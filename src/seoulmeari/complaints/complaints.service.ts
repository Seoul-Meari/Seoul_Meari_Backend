import { Injectable } from '@nestjs/common';
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
    async getComplaints(){
        return this.complaintRepository.find();
    }
    async getComplaintById(id: string){
        return this.complaintRepository.findOne({ where: { complaint_id: id } });
    }

    async createPresignedUrl(S3_url: string){
        try {
            console.log('S3 URL:', S3_url);
            const presignedUrl = await this.s3Service.getPresignedUrlForView(S3_url);
            console.log('생성된 Presigned URL:', presignedUrl);
            return presignedUrl;
        } catch (error) {
            console.error('Presigned URL 생성 실패:', error);
            throw new Error(`Presigned URL 생성 실패: ${error.message}`);
        }
    }
}
