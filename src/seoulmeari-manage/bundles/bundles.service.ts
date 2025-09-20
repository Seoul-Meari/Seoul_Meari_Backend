import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadSession } from './entities/upload-session.entity';
import { Bundle } from './entities/bundle.entity';
import { UploadStatus } from './enums/upload-status.enum';
import { Point } from 'geojson';
import { FinalizeUploadDto } from './dto/finalize-upload.dto';

/** ─────────────────────────────
 *  helpers: type guards
 *  ───────────────────────────── */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPoint(value: unknown): value is Point {
  return (
    isRecord(value) &&
    value.type === 'Point' &&
    Array.isArray(value.coordinates) &&
    value.coordinates.length === 2 &&
    value.coordinates.every((n) => typeof n === 'number')
  );
}

@Injectable()
export class BundlesService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepository: Repository<Bundle>,
    @InjectRepository(UploadSession)
    private readonly sessionRepository: Repository<UploadSession>,
  ) {}

  async finalizeUpload(
    finalizeDto: FinalizeUploadDto,
    layoutFile: Express.Multer.File,
  ) {
    // 1) JSON 파싱: any 방지 → unknown 으로 받고, record로 좁히기
    const jsonText = layoutFile.buffer.toString('utf-8');
    let layoutUnknown: unknown;
    try {
      layoutUnknown = JSON.parse(jsonText) as unknown;
    } catch {
      throw new BadRequestException(
        'Invalid layoutFile. Must be a valid JSON.',
      );
    }
    if (!isRecord(layoutUnknown)) {
      throw new BadRequestException('layoutFile must be a JSON object.');
    }
    const layoutJson: Record<string, unknown> = layoutUnknown; // 안전하게 좁힘

    // 2) 좌표/숫자 변환
    const latitude = Number(finalizeDto.latitude);
    const longitude = Number(finalizeDto.longitude);
    const height =
      finalizeDto.height != null ? Number(finalizeDto.height) : null;

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      (finalizeDto.height != null && Number.isNaN(height!))
    ) {
      throw new BadRequestException('Invalid coordinates.');
    }

    // 3) 트랜잭션
    const qr = this.bundleRepository.manager.connection.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // 3-1) 세션 락
      const session = await qr.manager
        .getRepository(UploadSession)
        .createQueryBuilder('s')
        .setLock('pessimistic_write')
        .where('s.id = :id', { id: finalizeDto.uploadId })
        .getOne();

      if (!session) {
        throw new NotFoundException(
          `Upload session ${finalizeDto.uploadId} not found.`,
        );
      }
      if (session.status !== UploadStatus.PENDING) {
        throw new ConflictException(
          `Upload session ${finalizeDto.uploadId} already processed.`,
        );
      }

      // 3-2) 태그 배열: 타입 안전 변환
      const tags: string[] =
        typeof finalizeDto.tags === 'string'
          ? finalizeDto.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

      // 3-3) usage/os: Bundle 타입에서 추론 받아 any 제거
      const usage: Bundle['usage'] = finalizeDto.usage;
      const os: Bundle['os'] = finalizeDto.os;

      // 3-4) location: 생성 값도 타입 보장
      const locationCandidate: unknown = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
      if (!isPoint(locationCandidate)) {
        throw new BadRequestException('Invalid location payload.');
      }
      const location: Point = locationCandidate;

      const newBundle = qr.manager.getRepository(Bundle).create({
        name: finalizeDto.name,
        version: finalizeDto.version,
        usage,
        os,
        tags,
        description: finalizeDto.description,
        layoutJson, // ← any 아님 (Record<string, unknown>)
        location, // ← Point 타입 확정
        height,
        uploadSession: session,
      });

      await qr.manager.getRepository(Bundle).save(newBundle);

      session.status = UploadStatus.COMPLETED;
      session.completedAt = new Date();
      await qr.manager.getRepository(UploadSession).save(session);

      await qr.commitTransaction();

      return {
        message: 'Bundle uploaded successfully',
        bundleId: newBundle.id,
        name: newBundle.name,
        version: newBundle.version,
        os: newBundle.os,
      };
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }
}
