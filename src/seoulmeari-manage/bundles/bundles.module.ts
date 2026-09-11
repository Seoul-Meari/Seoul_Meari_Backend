// src/bundles/bundles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { BundlesController } from './bundles.controller';
import { BundlesService } from './bundles.service';

import { Bundle } from './entities/bundle.entity';
import { UploadSession } from './entities/upload-session.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bundle, UploadSession]),
    ConfigModule,
    MulterModule.register({}),
  ],
  controllers: [BundlesController],
  providers: [BundlesService],
})
export class BundlesModule {}
