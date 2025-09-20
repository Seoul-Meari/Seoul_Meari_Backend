import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SeoulMeariModule } from './seoulmeari/seoulmeari.module';
import { SeoulMeariManageModule } from './seoulmeari-manage/seoulmeari-manage.module';
import { DatabaseModule } from './common/database/database.module';
import { S3Module } from './s3/s3.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    DatabaseModule,

    SeoulMeariModule,
    SeoulMeariManageModule,
    DatabaseModule,
    S3Module,
    RouterModule.register([
      { path: 'api', module: SeoulMeariModule },
      { path: 'manage', module: SeoulMeariManageModule },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
