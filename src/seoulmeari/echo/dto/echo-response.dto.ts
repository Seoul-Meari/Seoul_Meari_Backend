import { LocationData } from 'src/common/types/location-data.type';
import { Echo } from '../entities/echo.entity';

// echo-response.dto.ts
export class EchoResponseDto {
  id: string;
  writer: string;
  content: string;
  imageKey: string;
  createdAt: string;
  location: LocationData;

  constructor(entity: Echo) {
    this.id = entity.id;
    this.writer = entity.writer;
    this.content = entity.content;
    this.imageKey = entity.imageKey;
    this.createdAt = entity.createdAt;
    this.location = {
      longitude: entity.location.coordinates[0],
      latitude: entity.location.coordinates[1],
      z: entity.location.coordinates[2],
    };
  }
}
