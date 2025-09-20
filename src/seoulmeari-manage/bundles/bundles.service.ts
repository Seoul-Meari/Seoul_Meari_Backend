// src/bundles/bundles.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { UploadSession, UploadStatus } from './entities/upload-session.entity';
import { Bundle } from './entities/bundle.entity';
import { InitiateUploadDto } from './dto/initiate-upload.dto';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';
import { InitiateUploadResponseDto } from './dto/initiate-upload-response.dto';
import { FinalizeUploadResponseDto } from './dto/finalize-upload-response.dto';

@Injectable()
export class BundlesService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepository: Repository<Bundle>,
    @InjectRepository(UploadSession)
    private readonly sessionRepository: Repository<UploadSession>,
    private readonly configService: ConfigService,
  ) {

    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
  }

  async initiateUpload(
    initiateUploadDto: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    const s3Prefix = `bundles/uploads/${Date.now()}`;

    const session = this.sessionRepository.create({ s3Prefix });
    await this.sessionRepository.save(session);

    const urls = await Promise.all(
      initiateUploadDto.files.map(async (fileInfo) => {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: `${s3Prefix}/${fileInfo.fileName}`,
          ContentType: fileInfo.fileType,
        });
        const url = await getSignedUrl(this.s3Client, command, {
          expiresIn: 3600,
        }); // 1 hour expiry
        return { fileName: fileInfo.fileName, url };
      }),
    );

    return { uploadId: session.id, urls };
  }

  async finalizeUpload(
    finalizeDto: FinalizeUploadDto,
    layoutFile: Express.Multer.File,
  ): Promise<FinalizeUploadResponseDto> {
    if (!layoutFile) {
      throw new BadRequestException('layoutFile is missing.');
    }

    const session = await this.sessionRepository.findOneBy({
      id: finalizeDto.uploadId,
    });
    if (!session || session.status !== UploadStatus.PENDING) {
      throw new NotFoundException(
        `Upload session ${finalizeDto.uploadId} not found or already processed.`,
      );
    }

    let layoutJson: Record<string, any>;
    try {
      layoutJson = JSON.parse(layoutFile.buffer.toString('utf-8')) as Record<
        string,
        any
      >;
    } catch {
      throw new BadRequestException(
        'Invalid layoutFile. Must be a valid JSON.',
      );
    }

    const newBundle = this.bundleRepository.create({
      name: finalizeDto.name,
      version: finalizeDto.version,
      usage: finalizeDto.usage,
      os: finalizeDto.os,
      tags:
        finalizeDto.tags
          ?.split(',')
          .map((t) => t.trim())
          .filter(Boolean) ?? [],
      description: finalizeDto.description,
      layoutJson,
      latitude: parseFloat(finalizeDto.latitude),
      longitude: parseFloat(finalizeDto.longitude),
      height: finalizeDto.height ? parseFloat(finalizeDto.height) : undefined,
      uploadSession: session,
    });

    await this.bundleRepository.save(newBundle);

    session.status = UploadStatus.COMPLETED;
    await this.sessionRepository.save(session);

    return { message: 'Bundle uploaded successfully', bundleId: newBundle.id };
  }
}
