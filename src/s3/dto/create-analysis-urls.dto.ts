import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { FileUploadRequestDto } from './file-upload-request.dto';

export class CreateAnalysisUrlsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileUploadRequestDto)
  files: FileUploadRequestDto[];
}
