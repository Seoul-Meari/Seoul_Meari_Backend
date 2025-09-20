// src/bundles/bundles.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BundlesService } from './bundles.service';
import { InitiateUploadDto } from './dto/initiate-upload.dto';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';
import { Express } from 'express';
import { InitiateUploadResponseDto } from './dto/initiate-upload-response.dto';
import { FinalizeUploadResponseDto } from './dto/finalize-upload-response.dto';

@Controller('bundles')
export class BundlesController {
  constructor(private readonly bundlesService: BundlesService) {}

  @Post('initiate-upload')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  initiateUpload(
    @Body() initiateUploadDto: InitiateUploadDto,
  ): Promise<InitiateUploadResponseDto> {
    return this.bundlesService.initiateUpload(initiateUploadDto);
  }

  @Post('finalize-upload')
  @UseInterceptors(FileInterceptor('layoutFile'))
  finalizeUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })], // 5MB limit
      }),
    )
    layoutFile: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    finalizeDto: FinalizeUploadDto,
  ): Promise<FinalizeUploadResponseDto> {
    return this.bundlesService.finalizeUpload(finalizeDto, layoutFile);
  }
}
