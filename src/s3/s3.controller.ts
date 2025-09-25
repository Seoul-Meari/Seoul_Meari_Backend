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

  @Post('presigned-url/manage')
  async createPresignedUrl(@Body() body: { S3_url: string }) {
    try {
      console.log('Presigned URL 요청 받음:', body);

      // 요청 본문 검증
      if (!body || !body.S3_url) {
        throw new Error('S3_url이 필요합니다.');
      }

      // S3 URL에서 키 부분만 파싱
      const s3Url = body.S3_url;
      const key = s3Url.replace(/^s3:\/\/[^\/]+\//, '');
      console.log('파싱된 S3 키:', key);

      const result = await this.s3Service.createPresignedUrl(key);
      console.log('Presigned URL 생성 성공:', result);
      return {
        presigned_url: result,
        success: true,
      };
    } catch (error) {
      console.error('Presigned URL 생성 중 오류:', error);
      throw error;
    }
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
