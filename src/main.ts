import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'https://dev.d1kkujxdgesuxm.amplifyapp.com',
    ], // 허용할 출처
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
    allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 명시
    credentials: true, // 쿠키를 포함한 요청을 허용할지 여부
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
