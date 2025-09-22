import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';
import { AssetOS, AssetUsage } from '../type';

export class FinalizeUploadDto {
  @IsString() uploadId: string;

  @IsString() name: string;
  @IsString() version: string;

  @IsEnum(['historical', 'promo', 'both'])
  usage: AssetUsage;

  @IsEnum(['android', 'ios'])
  os: AssetOS;

  @IsString()
  @IsOptional()
  tags?: string; // 콤마구분 문자열

  @IsString()
  @IsOptional()
  description?: string;

  @IsLongitude() longitude: string; // 문자열로 들어와서 서비스에서 Number 변환
  @IsLatitude() latitude: string;
  @IsString() altitude: string; // 선택(숫자 문자열)
}
