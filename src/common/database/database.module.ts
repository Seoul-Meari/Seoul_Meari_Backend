import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // ConfigModule을 여기서도 import 해줍니다.
      imports: [ConfigModule],
      // useFactory는 ConfigService 같은 다른 Provider를 주입받을 수 있습니다.
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/../../**/*.entity.{js,ts}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        // ssl: {
        //   rejectUnauthorized: true,
        //   ca: fs
        //     .readFileSync('/home/ec2-user/certs/global-bundle.pem')
        //     .toString(),
        // },
      }),
      // useFactory에 주입할 Provider를 inject 배열에 명시합니다.
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
