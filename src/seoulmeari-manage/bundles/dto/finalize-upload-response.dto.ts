// src/bundles/dto/finalize-upload-response.dto.ts
import { IsString, IsUUID } from 'class-validator';

export class FinalizeUploadResponseDto {
  @IsString()
  message: string;

  @IsUUID()
  bundleId: string;
}
