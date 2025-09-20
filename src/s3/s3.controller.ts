import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';
import { CreateAnalysisUrlsDto } from './dto/create-analysis-urls.dto';
import { CreateEchoUrlDto } from './dto/create-echo-url.dto';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('presigned-urls/analysis')
  async createPresignedUrlsForAnalysis(
    @Body() createAnalysisUrlsDto: CreateAnalysisUrlsDto,
  ) {
    return this.s3Service.createPresignedUrlsForAnalysis(
      createAnalysisUrlsDto.files,
    );
  }

  @Post('presigned-url/echo')
  async createPresignedUrlForEcho(@Body() createEchoUrlDto: CreateEchoUrlDto) {
    const { filename, contentType } = createEchoUrlDto;
    return this.s3Service.createPresignedUrlForEcho(filename, contentType);
  }
}
