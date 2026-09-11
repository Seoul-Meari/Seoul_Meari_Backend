import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from 'src/seoulmeari/complaints/entities/complaint.entity';
import { Echo } from 'src/seoulmeari/echo/entities/echo.entity';
import { Between, Repository, MoreThan } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @InjectRepository(Echo)
    private readonly echoRepository: Repository<Echo>,
  ) {}

  async getSummary() {
    // 1. 기간 설정
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // 2. 데이터 조회
    // 지난 7일간의 데이터
    const recentComplaints = await this.complaintRepository.find({
      where: { timestamp: Between(sevenDaysAgo, today) },
    });

    // 그 이전 7일간의 데이터
    const previousComplaints = await this.complaintRepository.find({
      where: { timestamp: Between(fourteenDaysAgo, sevenDaysAgo) },
    });

    const totalEchos = await this.echoRepository.count();

    // 3. 핵심 지표 계산
    // 총 진단 건수
    const recentTotalCount = recentComplaints.length;
    const previousTotalCount = previousComplaints.length;
    const totalCountChange = previousTotalCount > 0 
      ? ((recentTotalCount - previousTotalCount) / previousTotalCount) * 100 
      : recentTotalCount > 0 ? 100 : 0;

    // 해결률
    const recentResolvedCount = recentComplaints.filter(c => c.is_confirmed).length;
    const recentResolutionRate = recentTotalCount > 0 ? (recentResolvedCount / recentTotalCount) * 100 : 0;
    
    const previousResolvedCount = previousComplaints.filter(c => c.is_confirmed).length;
    const previousResolutionRate = previousTotalCount > 0 ? (previousResolvedCount / previousTotalCount) * 100 : 0;
    
    const resolutionRateChange = previousResolutionRate > 0
      ? ((recentResolutionRate - previousResolutionRate) / previousResolutionRate) * 100
      : recentResolutionRate > 0 ? 100 : 0;

    return {
      totalDiagnoses: {
        count: recentTotalCount,
        changeRate: totalCountChange,
      },
      resolutionRate: {
        rate: recentResolutionRate,
        changeRate: resolutionRateChange,
      },
      echoCount: {
        count: totalEchos,
      },
    };
  }

  async getAiDiagnosisSummary() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // 전체 데이터 집계
    const totalCount = await this.complaintRepository.count();
    const resolvedCount = await this.complaintRepository.count({ where: { is_confirmed: true } });
    const pendingCount = totalCount - resolvedCount;

    // 최근 24시간 내 변동 집계
    const newTotal = await this.complaintRepository.count({
      where: { timestamp: MoreThan(yesterday) },
    });
    const newResolved = await this.complaintRepository.count({
      where: { is_confirmed: true, timestamp: MoreThan(yesterday) },
    });
    const newPending = newTotal - newResolved;

    return {
      total: {
        count: totalCount,
        change: newTotal,
      },
      resolved: {
        count: resolvedCount,
        change: newResolved,
      },
      pending: {
        count: pendingCount,
        change: newPending,
      },
    };
  }

  async getWeeklyDiagnoses() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const complaints = await this.complaintRepository.find({
      where: {
        timestamp: Between(sevenDaysAgo, today),
      },
      order: {
        timestamp: 'ASC',
      },
    });

    const weeklyData: { [key: string]: { total: number; resolved: number } } = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
      weeklyData[dateString] = { total: 0, resolved: 0 };
    }

    complaints.forEach(complaint => {
      if (complaint.timestamp) {
        const dateString = complaint.timestamp.toISOString().split('T')[0];
        if (weeklyData[dateString]) {
          weeklyData[dateString].total += 1;
          if (complaint.is_confirmed) {
            weeklyData[dateString].resolved += 1;
          }
        }
      }
    });
    
    // 날짜 오름차순으로 정렬된 배열로 변환
    return Object.entries(weeklyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getTagDistribution() {
    const tagCounts = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('complaint.tag', 'tag')
      .addSelect('COUNT(*)', 'count')
      .groupBy('complaint.tag')
      .orderBy('count', 'DESC')
      .getRawMany();

    return tagCounts.map(item => ({
      tag: item.tag || '미분류',
      count: parseInt(item.count, 10),
    }));
  }

  async getHourlyComplaintDistribution() {
    const hourlyCounts = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('EXTRACT(HOUR FROM complaint.timestamp)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .where("complaint.timestamp IS NOT NULL")
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    const result = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));

    hourlyCounts.forEach(item => {
      // getRawMany() returns string values for numerical types from the DB
      const hour = parseInt(item.hour, 10);
      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        result[hour].count = parseInt(item.count, 10);
      }
    });

    return result;
  }
}
