import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UploadStatus } from '../enums/upload-status.enum';

@Entity('upload_sessions')
@Index(['id'], { unique: true })
export class UploadSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UploadStatus, default: UploadStatus.PENDING })
  status: UploadStatus;

  @Column({ type: 'text', name: 's3_prefix', nullable: true })
  s3Prefix: string | null;

  @Column({ type: 'jsonb', nullable: true })
  files: Array<{ fileName: string; key: string; contentType: string }> | null;

  @Column({ type: 'timestamptz', name: 'expires_at', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
