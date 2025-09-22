import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { S3Service } from './s3.service';
import { CreateAnalysisUrlsDto } from './dto/create-analysis-urls.dto';
import { CreateEchoUrlDto } from './dto/create-echo-url.dto';
import { InitiateUploadDto } from './dto/bundle/initiate-upload.dto';
import { InitiateUploadResponseDto } from './dto/bundle/initiate-upload-response.dto';

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

  @Get('presigned-url/echo/image')
  async getPresignedUrlForEchoImage(@Query('image-key') imageKey: string) {
    return this.s3Service.getPresignedUrlForEchoImage(imageKey);
  }

  @Post('presigned-urls/bundle')
  async createPresignedUrlForBundle(
    @Body() initiateUploadDto: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    return this.s3Service.createPresignedUrlsForBundle(initiateUploadDto);
  }
}
