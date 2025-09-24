import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from 'src/seoulmeari/complaints/entities/complaint.entity';
import { Echo } from 'src/seoulmeari/echo/entities/echo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, Echo])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
