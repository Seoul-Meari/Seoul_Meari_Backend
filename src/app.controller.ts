import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Unity 클라이언트가 서버 상태를 확인할 수 있는 엔드포인트입니다.
   * 이 엔드포인트가 200 OK 응답을 반환하면 서버가 정상적으로 실행 중임을 의미합니다.
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    console.log('health check');
    return { status: 'ok', message: 'Server is up and running' };
  }
}
