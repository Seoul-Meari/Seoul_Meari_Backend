import { Controller, Post, Body } from '@nestjs/common';
import { EchoService } from './echo.service';
import { CreateEchoDto } from './dto/create-echo.dto';

@Controller('echo')
export class EchoController {
  constructor(private readonly echoService: EchoService) {}

  @Post()
  create(@Body() createEchoDto: CreateEchoDto) {
    return this.echoService.echo(createEchoDto); // 메소드 이름 변경
  }
}
