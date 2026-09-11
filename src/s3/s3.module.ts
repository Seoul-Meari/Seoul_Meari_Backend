import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadSession } from 'src/seoulmeari-manage/bundles/entities/upload-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadSession]), ConfigModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
