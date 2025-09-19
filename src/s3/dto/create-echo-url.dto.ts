import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEchoUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
