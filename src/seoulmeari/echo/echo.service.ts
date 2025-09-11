import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateEchoDto } from './dto/create-echo.dto'; // DTO 경로는 그대로 둡니다.

export interface Echo {
  id: string;
  writer: string;
  content: string;
  createdAt: Date;
  location: any;
}

@Injectable()
export class EchoService {
  echo(createEchoDto: CreateEchoDto): Echo {
    const { writer, content, location } = createEchoDto;

    const newEcho: Echo = {
      id: uuidv4(),
      writer,
      content,
      createdAt: new Date(),
      location,
    };

    console.log('Echo successful:', newEcho);
    return newEcho;
  }
}
