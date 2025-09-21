import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BundlesService } from './bundles.service';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';
import { GetBundlesQueryDto } from './dto/get-bundles.dto';

@Controller('bundles')
export class BundlesController {
  constructor(private readonly bundlesService: BundlesService) {}

  @Get()
  async getBundles(@Query() queryDto: GetBundlesQueryDto) {
    return this.bundlesService.getBundles(queryDto);
  }

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
