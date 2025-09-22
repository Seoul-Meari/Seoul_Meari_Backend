// src/seoulmeari/complaints/complaint.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'complaints' })
export class Complaint {
  @PrimaryColumn('uuid')
  complaint_id!: string;

  @Column('uuid')
  admin_id!: string;

  @Column('double precision', { nullable: true }) latitude?: number;
  @Column('double precision', { nullable: true }) longitude?: number;
  @Column('int', { nullable: true }) accuracy?: number;
  @Column('double precision', { nullable: true }) altitude?: number;
  @Column('text', { nullable: true }) tag?: string;
  @Column('double precision', { nullable: true }) coordinates?: number;
  @Column('double precision', { nullable: true }) direction?: number;

  @Column('timestamp', { nullable: true }) timestamp?: Date;
  @Column('text', { name: 'S3_url', nullable: true }) S3_url?: string;

  @Column('text', { nullable: true }) danger?: string;
  @Column('text', { nullable: true }) solution?: string;
  @Column('text', { nullable: true }) detail?: string;
  @Column('boolean', { nullable: true }) is_confirmed?: boolean;
}
