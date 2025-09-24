import { 
  Controller,
  Post,
  Body,
  Get,
  Query,
  ParseFloatPipe,
  Param,
  Delete,
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

  @Get('/echo-list')
  async getEchoList(){
    return this.echoService.getEchoList();
  }

  @Get('/echo-list/:id')
  async getEchoById(@Param('id') id: string){
    const result = await this.echoService.getEchoById(id);
    console.log('민원 데이터 조회 결과:', result);
    return result;
  }

  @Delete('/echo-list/:id')
  async deleteEchoById(@Param('id') id: string){
    const ok = await this.echoService.deleteEcho(id);
    console.log(ok);
    return ok ? { success: true } : { success: false, message: 'Not found' };
  }

  
}
