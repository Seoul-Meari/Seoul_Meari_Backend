import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UploadSession } from './upload-session.entity';
import { Point } from 'geojson';

export type AssetUsage = 'historical' | 'promo' | 'both';
export type AssetOS = 'android' | 'ios';

@Entity('bundles')
@Index(['name', 'version'], { unique: true }) // 필요 시 os까지 포함: ['name','version','os']
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() name: string;
  @Column() version: string;

  @Column({ type: 'enum', enum: ['historical', 'promo', 'both'] })
  usage: AssetUsage;

  @Column({ type: 'enum', enum: ['android', 'ios'] })
  os: AssetOS;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { name: 'layout_json' })
  layoutJson: object;

  // PostGIS: geography(Point,4326)  — 좌표는 [lon, lat] 순서
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    name: 'location',
  })
  location: Point;

  // 고도(미터)
  @Column('double precision', { nullable: true })
  height: number | null;

  @OneToOne(() => UploadSession)
  @JoinColumn({ name: 'upload_session_id' })
  uploadSession: UploadSession;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
