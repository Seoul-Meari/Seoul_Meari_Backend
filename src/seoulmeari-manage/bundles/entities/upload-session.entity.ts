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

  @Column({ type: 'timestamptz', name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
