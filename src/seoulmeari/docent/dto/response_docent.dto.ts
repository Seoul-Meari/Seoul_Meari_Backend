import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ResponseDocentDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @IsString()
  @IsNotEmpty()
  message?: string;

  @IsString()
  @IsNotEmpty()
  answer?: string;
}
