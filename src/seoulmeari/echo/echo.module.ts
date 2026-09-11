import { Module } from '@nestjs/common';
import { EchoController } from './echo.controller';
import { EchoService } from './echo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Echo } from './entities/echo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Echo]), ConfigModule],
  controllers: [EchoController],
  providers: [EchoService],
})
export class EchoModule {}
