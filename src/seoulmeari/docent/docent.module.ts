import { Module } from '@nestjs/common';
import { DocentController } from './docent.controller';
import { DocentService } from './docent.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({})],
  controllers: [DocentController],
  providers: [DocentService],
  exports: [DocentService],
})
export class DocentModule {}
