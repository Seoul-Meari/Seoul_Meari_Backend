import { Controller, Get, Post, Body } from '@nestjs/common';
import { DocentService } from './docent.service';

@Controller('docent')
export class DocentController {
  constructor(private readonly docentService: DocentService) {}

  @Get()
  healthCheck() {
    return { status: 'ok', service: 'docent' };
  }

  @Post('/question')
  async docentAnswer(@Body() body: { gps_data: string; img_url: string; question: string }) {
    try {
      const answer = await this.docentService.makeAnswer(
        body.gps_data,
        body.img_url,
        body.question,
      );
      return { success: true, answer };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
