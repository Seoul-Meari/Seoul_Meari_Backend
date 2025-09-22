import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetStatus } from '../enums/asset-status.enum';
import { AssetOS, AssetUsage } from '../type';

export class GetBundlesQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(['historical', 'promo', 'both', 'all'])
  usage?: AssetUsage | 'all';

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus | 'all';

  @IsOptional()
  @IsEnum(['android', 'ios', 'all'])
  os?: AssetOS | 'all';

  @IsOptional()
  @IsEnum(['recent', 'size', 'name'])
  sortBy?: 'recent' | 'size' | 'name' = 'recent';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
