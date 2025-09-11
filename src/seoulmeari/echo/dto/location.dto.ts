import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  z: number; // C#의 float? 는 TypeScript의 number? 로 표현
}
