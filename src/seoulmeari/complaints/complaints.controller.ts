import { Controller, Get, Param, Patch } from '@nestjs/common';
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

  @Patch('/complaints-list/:id/resolve')
  async resolve(@Param('id') id: string) {
    const complaint = await this.complaintsService.resolveComplaint(id);
    return { success: true, complaint };
  }
}
