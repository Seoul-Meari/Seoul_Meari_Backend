import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { InitiateUploadDto } from './dto/bundle/initiate-upload.dto';
import { InitiateUploadResponseDto } from './dto/bundle/initiate-upload-response.dto';
import { FileUploadRequestDto } from './dto/file-upload-request.dto';
import { UploadSession } from 'src/seoulmeari-manage/bundles/entities/upload-session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadStatus } from 'src/seoulmeari-manage/bundles/enums/upload-status.enum';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UploadSession)
    private readonly uploadRepo: Repository<UploadSession>,
  ) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
      // accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      // secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;
  }

  /**
   * 분석용 이미지들의 Presigned URL을 병렬로 생성합니다.
   */
  async createPresignedUrlsForAnalysis(files: FileUploadRequestDto[]) {
    const promises = files.map((file) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const dateFolderPath = `${year}${month}${day}`;
      const timeFileNamePart = `${hours}${minutes}${seconds}`;
      const objectName = file.objectName;
      const uniqueId = uuidv4().substring(0, 8);
      const extension = path.extname(file.originalFilename);

      const key = `upload_image/${dateFolderPath}/${timeFileNamePart}_${objectName}_${uniqueId}${extension}`;

      const params = {
        Bucket: this.bucketName,
        Key: key,
        ContentType: file.contentType,
        Expires: 300, // 5분
      };
      return this.s3
        .getSignedUrlPromise('putObject', params)
        .then((url) => ({ url, key }));
    });

    return Promise.all(promises);
  }

  /**
   * 메아리용 단일 이미지의 Presigned URL을 생성합니다.
   */
  async createPresignedUrlForEcho(filename: string, contentType: string) {
    const uniqueId = uuidv4();
    const extension = path.extname(filename);
    const baseFilename = path.basename(filename, extension);
    const key = `echo_images/${uniqueId}-${baseFilename}${extension}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Expires: 300, // 5분
    };

    const url = await this.s3.getSignedUrlPromise('putObject', params);
    return { url, key };
  }

  /**
   * 번들 업로드를 위한 Presigned URL을 생성합니다.
   */
  // s3.service.ts (발췌)
  async createPresignedUrlsForBundle(
    dto: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    const uploadId = uuidv4();
    const s3Prefix = `bundles/${uploadId}/`;

    // 1) 세션 선 생성
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15m
    const filesMeta = dto.files.map((f) => ({
      fileName: f.fileName,
      key: `${s3Prefix}${path.basename(f.fileName)}`, // 필요하면 규칙 더 엄격히
      contentType: f.fileType,
    }));

    await this.uploadRepo.insert({
      id: uploadId,
      status: UploadStatus.PENDING,
      s3Prefix,
      files: filesMeta,
      expiresAt,
    });

    // 2) presigned URL 발급
    const urls = await Promise.all(
      filesMeta.map(async (file) => {
        const presignedUrl = await this.s3.getSignedUrlPromise('putObject', {
          Bucket: this.bucketName,
          Key: file.key,
          ContentType: file.contentType,
          Expires: 300, // 5m
        });
        return { fileName: file.fileName, url: presignedUrl };
      }),
    );

    // 3) 상태 전환(선택)
    await this.uploadRepo.update(uploadId, { status: UploadStatus.UPLOADING });

    return { uploadId, urls };
  }

  /**
   * (관리자용) 파일 조회를 위한 Presigned URL을 생성합니다.
   */
  async getPresignedUrlForView(key: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600, // 1시간
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  /**
   * 에코 이미지 조회를 위한 Presigned URL을 생성합니다.
   */
  async getPresignedUrlForEchoImage(key: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 3600, // 1시간
    };
    return await this.s3.getSignedUrlPromise('getObject', params);
  }
}
