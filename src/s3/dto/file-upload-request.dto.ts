import { IsNotEmpty, IsString } from 'class-validator';

export class FileUploadRequestDto {
  @IsString()
  @IsNotEmpty()
  originalFilename: string;

  @IsString()
  @IsNotEmpty()
  objectName: string;
}
