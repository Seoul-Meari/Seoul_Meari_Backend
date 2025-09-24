import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('ai-summary')
  async getAiDiagnosisSummary() {
    return this.dashboardService.getAiDiagnosisSummary();
  }

  @Get('weekly-diagnoses')
  async getWeeklyDiagnoses() {
    return this.dashboardService.getWeeklyDiagnoses();
  }

  @Get('tag-distribution')
  async getTagDistribution() {
    return this.dashboardService.getTagDistribution();
  }

  @Get('hourly-complaint-distribution')
  async getHourlyComplaintDistribution() {
    return this.dashboardService.getHourlyComplaintDistribution();
  }
}
