// src/bundles/unity.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UnityService } from './unity.service';

@Controller('unity')
export class UnityController {
  constructor(private readonly unityService: UnityService) {}

  @Get('bundles/:name/:version')
  async getBundleByNameAndVersion(
    @Param('name') name: string,
    @Param('version') version: string,
  ) {
    const bundle = await this.unityService.getBundleMetadata(name, version);
    if (!bundle) {
      throw new NotFoundException();
    }
    return bundle;
  }
}
