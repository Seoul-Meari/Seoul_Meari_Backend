import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocentDto {
  @IsString()
  @IsNotEmpty()
  gps_data: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}
