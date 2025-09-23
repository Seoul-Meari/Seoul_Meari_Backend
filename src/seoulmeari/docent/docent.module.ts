import { Module } from '@nestjs/common';
import { DocentController } from './docent.controller';
import { DocentService } from './docent.service';

@Module({
  imports: [],
  controllers: [DocentController],
  providers: [DocentService],
  exports: [DocentService],
})
export class DocentModule {}