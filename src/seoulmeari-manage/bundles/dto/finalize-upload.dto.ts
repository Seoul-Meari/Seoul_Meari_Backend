// src/bundles/dto/finalize-upload.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { AssetOS, AssetUsage } from '../entities/bundle.entity';

export class FinalizeUploadDto {
  @IsUUID()
  uploadId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsEnum(['historical', 'promo', 'both'])
  usage: AssetUsage;

  @IsEnum(['android', 'ios'])
  os: AssetOS;

  @IsString()
  @IsOptional()
  tags: string; // Comma-separated string

  @IsString()
  @IsOptional()
  description: string;

  @IsNumberString()
  latitude: string;

  @IsNumberString()
  longitude: string;

  @IsNumberString()
  @IsOptional()
  height: string;
}
