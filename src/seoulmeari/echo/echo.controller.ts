import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { EchoService } from './echo.service';
import { CreateEchoDto } from './dto/create-echo.dto';
import { EchoResponseDto } from './dto/echo-response.dto';

@Controller('echo')
export class EchoController {
  constructor(private readonly echoService: EchoService) {}

  @Get('/nearby')
  async getNearbyEchos(
    @Query('lat', ParseFloatPipe) latitude: number,
    @Query('lon', ParseFloatPipe) longitude: number,
    @Query('z', ParseFloatPipe) z: number,
    @Query('degree', ParseFloatPipe) degree: number,
  ): Promise<EchoResponseDto[]> {
    return this.echoService.findNearbyEchos(latitude, longitude, z, degree);
  }

  @Post()
  create(@Body() createEchoDto: CreateEchoDto): Promise<EchoResponseDto> {
    return this.echoService.create(createEchoDto); // 메소드 이름 변경
  }
}
