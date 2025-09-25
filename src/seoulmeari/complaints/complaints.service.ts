import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    private readonly s3Service: S3Service,
  ) {}
  async getComplaints() {
    return this.complaintRepository.find();
  }
  async getComplaintById(id: string) {
    return this.complaintRepository.findOne({ where: { complaint_id: id } });
  }

  async resolveComplaint(id: string) {
    const complaint = await this.complaintRepository.findOne({
      where: { complaint_id: id },
    });
    if (!complaint) throw new NotFoundException('민원을 찾을 수 없습니다.');

    if (complaint.is_confirmed == false) {
      complaint.is_confirmed = true;
      await this.complaintRepository.save(complaint);
    }
    return complaint;
  }
}
