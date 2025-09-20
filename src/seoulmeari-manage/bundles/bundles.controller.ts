import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BundlesService } from './bundles.service';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';

@Controller('bundles')
export class BundlesController {
  constructor(private readonly bundlesService: BundlesService) {}

  @Post('finalize-upload')
  @UseInterceptors(FileInterceptor('layoutFile'))
  async finalizeUpload(
    @Body() finalizeDto: FinalizeUploadDto,
    @UploadedFile() layoutFile: Express.Multer.File,
  ) {
    if (!layoutFile) {
      throw new BadRequestException('layoutFile is missing.');
    }
    return this.bundlesService.finalizeUpload(finalizeDto, layoutFile);
  }
}
