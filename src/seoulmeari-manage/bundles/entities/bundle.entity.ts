// src/bundles/entities/bundle.entity.ts
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

// Re-using types from your frontend for consistency
export type AssetUsage = 'historical' | 'promo' | 'both';
export type AssetOS = 'android' | 'ios';

@Entity('bundles')
@Index(['name', 'version'], { unique: true }) // Ensure no duplicate name/version pairs
export class Bundle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column({ type: 'enum', enum: ['historical', 'promo', 'both'] })
  usage: AssetUsage;

  @Column({ type: 'enum', enum: ['android', 'ios'] })
  os: AssetOS;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('text', { nullable: true })
  description: string;

  // The parsed content of layoutFile is stored here
  @Column('jsonb', { name: 'layout_json' })
  layoutJson: object;

  // Geographic coordinates
  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column('double precision', { nullable: true })
  height: number;

  // Link to the upload session that created this bundle
  @OneToOne(() => UploadSession)
  @JoinColumn({ name: 'upload_session_id' })
  uploadSession: UploadSession;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
