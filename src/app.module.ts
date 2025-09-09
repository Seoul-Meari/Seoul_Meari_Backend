import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EchoModule } from './echo/echo.module';
import { MediaModule } from './media/media.module';
import { PlacesModule } from './places/places.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, EchoModule, MediaModule, PlacesModule, AdminModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
