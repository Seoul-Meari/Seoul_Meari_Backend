import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { SeoulMeariModule } from './seoulmeari/seoulmeari.module';
import { SeoulMeariManageModule } from './seoulmeari-manage/seoulmeari-manage.module';
import { DatabaseModule } from './common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

console.log('DATABASE NAME FROM ENV:', process.env.DB_DATABASE);
console.log('DATABASE USER FROM ENV:', process.env.DB_USERNAME);

@Module({
  imports: [
    // 1. ConfigModule을 전역으로 설정하는 것은 그대로 유지합니다.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. TypeOrmModule.forRoot(...) 대신 DatabaseModule을 import 합니다.
    DatabaseModule,

    SeoulMeariModule,
    SeoulMeariManageModule,
    DatabaseModule,
    RouterModule.register([
      { path: 'api', module: SeoulMeariModule },
      { path: 'manage', module: SeoulMeariManageModule },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
