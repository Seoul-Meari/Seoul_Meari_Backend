import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  checkConnection() {
    return 'Complaints API is running';
  }

  @Get('/complaints-list')
  async getComplaints() {
    const result = await this.complaintsService.getComplaints();
    console.log('민원 데이터 조회 결과:', result);
    return result;
  }

  @Get('/complaints-list/:id')
  async getComplaintById(@Param('id') id: string) {
    const result = await this.complaintsService.getComplaintById(id);
    console.log('민원 데이터 조회 결과:', result);
    return result;
  }

  @Post('/presigned-url')
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

      const result = await this.complaintsService.createPresignedUrl(key);
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

  @Patch('/complaints-list/:id/resolve')
  async resolve(@Param('id') id: string) {
    const complaint = await this.complaintsService.resolveComplaint(id);
    return { success: true, complaint };
  }
}
