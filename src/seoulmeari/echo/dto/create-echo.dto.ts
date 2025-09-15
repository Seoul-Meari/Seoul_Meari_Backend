import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateEchoDto {
  @IsNumber()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  writer: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @ValidateNested() // 중첩된 객체(LocationDto)를 검증
  @Type(() => LocationDto) // Nest가 location 객체를 LocationDto 클래스로 변환하도록 함
  location: LocationDto;
}
