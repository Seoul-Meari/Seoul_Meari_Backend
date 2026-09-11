// // src/bundles/unity.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { Bundle } from './entities/bundle.entity';

// @Injectable()
// export class UnityService {
//   private readonly cdnUrl: string;

//   constructor(
//     @InjectRepository(Bundle)
//     private readonly bundleRepository: Repository<Bundle>,
//     private readonly configService: ConfigService,
//   ) {
//     this.cdnUrl = this.configService.getOrThrow<string>('BUCKET_URL');
//   }

//   async getBundleMetadata(name: string, version: string) {
//     const bundle = await this.bundleRepository.findOne({
//       where: { name, version },
//       relations: ['uploadSession'], // We need the session to get the S3 prefix
//     });

//     if (!bundle) {
//       throw new NotFoundException(
//         `Bundle with name '${name}' and version '${version}' not found.`,
//       );
//     }

//     // Construct the bundle URL. We assume the main asset bundle file has a predictable name,
//     // often the same as the manifest without the extension. Let's assume it's 'assetbundle.android' or similar.
//     // This part might need adjustment based on your actual file naming convention.
//     const s3Prefix = bundle.uploadSession.s3Prefix;
//     // Let's assume the bundle file is named after the bundle's name. This is a common pattern.
//     const bundleFileName = `${bundle.name.toLowerCase()}.${bundle.os}`;
//     const bundleUrl = `${this.cdnUrl}/${s3Prefix}/${bundleFileName}`;

//     // Combine database fields and the layout JSON into a single response object
//     // that matches the structure Unity expects.
//     return {
//       bundleId: bundle.id,
//       bundleUrl,
//       ...bundle.layoutJson, // Spread the contents of the layout JSON
//       // Overwrite/add top-level metadata from the database for consistency
//       name: bundle.name,
//       version: bundle.version,
//       usage: bundle.usage,
//       os: bundle.os,
//       tags: bundle.tags,
//       description: bundle.description,
//       updatedAt: bundle.updatedAt,
//       // You might calculate totalSizeMB on the backend during finalize if needed
//     };
//   }
// }
