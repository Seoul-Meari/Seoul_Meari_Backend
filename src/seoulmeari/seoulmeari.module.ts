import { Module } from '@nestjs/common';
import { PlacesModule } from './places/places.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './auth/auth.module';
import { EchoModule } from './echo/echo.module';
import { ComplaintsModule } from './complaints/complaints.module';

@Module({
  imports: [PlacesModule, MediaModule, AuthModule, EchoModule, ComplaintsModule],
})
export class SeoulMeariModule {}
