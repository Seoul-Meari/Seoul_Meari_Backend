import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEchoDto } from './dto/create-echo.dto'; // DTO 경로는 그대로 둡니다.
import { EchoResponseDto } from './dto/echo-response.dto';
import { Echo } from './entities/echo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Point } from 'geojson';
import { ConfigService } from '@nestjs/config';
import { PaginateEchoDto } from './dto/paginate-echo.dto';

@Injectable()
export class EchoService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(Echo) private readonly echoRepo: Repository<Echo>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new AWS.S3({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME')!;
  }

  async create(createEchoDto: CreateEchoDto): Promise<EchoResponseDto> {
    const { id, writer, content, imageKey, createdAt, location } =
      createEchoDto;

    if (imageKey) {
      try {
        await this.s3
          .headObject({ Bucket: this.bucketName, Key: imageKey })
          .promise();
      } catch {
        throw new BadRequestException('imageKey not found on S3');
      }
    }

    const point: Point = {
      type: 'Point',
      // 중요: GeoJSON 표준은 [경도(longitude), 위도(latitude), 고도(z)] 순서입니다.
      coordinates: [location.longitude, location.latitude, location.z],
    };

    const newEcho: Echo = {
      id,
      writer,
      content,
      imageKey,
      createdAt,
      location: point,
    };

    const saved = await this.echoRepo.save(newEcho);

    return new EchoResponseDto(saved);
  }

  /**
   * 그리드 내의 모든 Echo 데이터를 찾습니다.
   * @param longitude - 중심점의 경도 (X 좌표)
   * @param latitude - 중심점의 위도 (Y 좌표)
   * @param degree - 격자간 간격
   * @returns Echo[]
   */
  async findNearbyEchos(
    latitude: number,
    longitude: number,
    z: number,
    degree: number,
  ): Promise<EchoResponseDto[]> {
    const minLat = latitude;
    const maxLat = latitude + degree;
    const minLon = longitude;
    const maxLon = longitude + degree;

    console.log(
      `minLat: ${minLat} maxLat: ${maxLat} minLon: ${minLon} maxLon: ${maxLon} degree: ${degree}`,
    );

    const echos = await this.echoRepo
      .createQueryBuilder('echo')
      .where('ST_Y(echo.location::geometry) BETWEEN :minLat AND :maxLat', {
        minLat,
        maxLat,
      })
      .andWhere('ST_X(echo.location::geometry) BETWEEN :minLon AND :maxLon', {
        minLon,
        maxLon,
      })
      .getMany();

    // 2. 조회된 엔티티 배열을 DTO 배열로 변환하여 반환
    console.log(echos);
    return echos.map((echo) => new EchoResponseDto(echo));
  }

  async getEchoList({ page = 1, limit = 20, search = '' }: PaginateEchoDto) {
    const qb = this.echoRepo.createQueryBuilder('e');

    if (search && search.trim() !== '') {
      const q = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(
        new Brackets((w) => {
          w.where('LOWER(e.content) LIKE :q', { q }).orWhere(
            'LOWER(e.writer) LIKE :q',
            { q },
          );
        }),
      );
    }

    qb.orderBy('e.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    // 오늘(KST) 시작~현재까지 생성된 개수 계산
    // (서버 TZ가 UTC여도 문제없도록 KST 00:00을 UTC로 변환)
    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const kstStart = new Date(
      Date.UTC(
        kstNow.getUTCFullYear(),
        kstNow.getUTCMonth(),
        kstNow.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const utcStartOfKst = new Date(kstStart.getTime() - 9 * 60 * 60 * 1000);

    const todayCount = await this.echoRepo
      .createQueryBuilder('t')
      .where('t.createdAt >= :start', { start: utcStartOfKst.toISOString() })
      .getCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pageCount: Math.ceil(total / limit),
        hasPrev: page > 1,
        hasNext: page * limit < total,
        todayCount, // 프론트 통계 카드용
      },
    };
  }

  async getEchoById(id: string) {
    return this.echoRepo.findOne({ where: { id: id } });
  }

  async deleteEcho(id: string): Promise<boolean> {
    const existing = await this.echoRepo.findOne({ where: { id } });
    if (!existing) {
      return false;
    }
    // 이미지가 연결되어 있으면 S3에서도 시도 삭제 (실패해도 무시)
    if (existing.imageKey) {
      try {
        await this.s3
          .deleteObject({ Bucket: this.bucketName, Key: existing.imageKey })
          .promise();
      } catch (_) {}
    }
    await this.echoRepo.delete({ id });
    return true;
  }
}
