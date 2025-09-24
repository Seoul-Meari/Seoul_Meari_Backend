import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { DocentService } from './docent.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateDocentDto } from './dto/create_docent.dto';
import { ResponseDocentDto } from './dto/response_docent.dto';
import * as fs from 'node:fs/promises';

const logger = new Logger('DocentController');

@Controller('docent')
export class DocentController {
  constructor(private readonly docentService: DocentService) {}

  @Get()
  healthCheck() {
    return { status: 'ok', service: 'docent' };
  }

  @Post('/question')
  @UseInterceptors(
    FileInterceptor('img_file', {
      storage: diskStorage({
        destination: '/tmp/docent', // 컨테이너/EC2에서 쓰기 가능한 경로(없으면 생성)
        filename: (_req, file, cb) => {
          const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, name + extname(file.originalname || '.jpg'));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        if (!/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) {
          return cb(new Error('Invalid image type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async docentAnswer(
    @UploadedFile() img_file: Express.Multer.File,
    @Body() body: CreateDocentDto,
  ): Promise<ResponseDocentDto> {
    try {
      const answer: string = await this.docentService.makeAnswer(
        body.gps_data,
        img_file.path,
        img_file.mimetype,
        body.question,
      );
      return { success: true, answer };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      // 성공/실패와 무관하게 즉시 삭제
      try {
        await fs.unlink(img_file.path);
      } catch (e: any) {
        logger.warn(`temp file cleanup failed: ${e}`);
      }
    }
  }
}
