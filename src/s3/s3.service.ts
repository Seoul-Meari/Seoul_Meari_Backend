import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileUploadRequestDto } from './dto/file-upload-request.dto';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
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
}
