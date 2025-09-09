import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SeoulMeariModule } from './seoulmeari/seoulmeari.module';
import { SeoulMeariManageModule } from './seoulmeari-manage/seoulmeari-manage.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    SeoulMeariModule,
    SeoulMeariManageModule,
    DatabaseModule,
    RouterModule.register([
      { path: 'api', module: SeoulMeariModule },
      { path: 'manage', module: SeoulMeariManageModule },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
