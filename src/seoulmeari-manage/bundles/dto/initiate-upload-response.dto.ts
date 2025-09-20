// src/bundles/dto/initiate-upload-response.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

class PresignedUrlDto {
  @IsString()
  fileName: string;

  @IsString()
  url: string;
}

export class InitiateUploadResponseDto {
  @IsUUID()
  uploadId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresignedUrlDto)
  urls: PresignedUrlDto[];
}
