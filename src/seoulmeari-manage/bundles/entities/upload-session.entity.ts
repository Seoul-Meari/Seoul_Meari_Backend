// src/bundles/entities/upload-session.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UploadStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('upload_sessions')
export class UploadSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UploadStatus,
    default: UploadStatus.PENDING,
  })
  status: UploadStatus;

  // The prefix in S3 where the files are stored, e.g., "bundles/uploads/{sessionId}"
  @Column({ name: 's3_prefix' })
  s3Prefix: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
