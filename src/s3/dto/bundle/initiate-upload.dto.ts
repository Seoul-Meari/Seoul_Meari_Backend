import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadFileInfoDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string; // e.g. "application/octet-stream", "application/x-gzip"
}

export class InitiateUploadDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadFileInfoDto)
  files!: UploadFileInfoDto[];
}
