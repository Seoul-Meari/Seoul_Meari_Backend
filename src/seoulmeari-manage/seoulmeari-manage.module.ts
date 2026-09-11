import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { BundlesModule } from './bundles/bundles.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [AdminModule, AuthModule, BundlesModule, DashboardModule],
})
export class SeoulMeariManageModule {}
