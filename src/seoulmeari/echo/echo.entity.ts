import { Point } from 'geojson';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'echo' })
export class Echo {
  // 클라이언트가 id를 생성해서 보내므로 PrimaryColumn으로 지정
  @PrimaryColumn('text')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  writer: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageKey: string;

  @CreateDateColumn({ name: 'created_at', type: 'varchar', length: 100 })
  createdAt: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'PointZ',
    srid: 4326,
  })
  location: Point;
}
