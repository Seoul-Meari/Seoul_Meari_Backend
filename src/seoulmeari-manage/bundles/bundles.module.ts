// src/bundles/bundles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { BundlesController } from './bundles.controller';
import { BundlesService } from './bundles.service';
import { UnityController } from './unity.controller';
import { UnityService } from './unity.service';

import { Bundle } from './entities/bundle.entity';
import { UploadSession } from './entities/upload-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bundle, UploadSession]),
    ConfigModule, // Make sure ConfigModule is global in your AppModule or imported here
  ],
  controllers: [BundlesController, UnityController],
  providers: [BundlesService, UnityService],
})
export class BundlesModule {}
