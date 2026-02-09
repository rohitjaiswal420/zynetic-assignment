import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterReading, VehicleReading } from '../models/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(MeterReading) private meterRepo: Repository<MeterReading>,
    @InjectRepository(VehicleReading) private vehicleRepo: Repository<VehicleReading>,
  ) {}

  async performance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const dc = await this.vehicleRepo
      .createQueryBuilder('v')
      .select('SUM(v.kwhDeliveredDc)', 'total')
      .addSelect('AVG(v.batteryTemp)', 'avgTemp')
      .where('v.vehicleId = :vehicleId', { vehicleId })
      .andWhere('v.timestamp > :since', { since })
      .getRawOne();

    const ac = await this.meterRepo
      .createQueryBuilder('m')
      .select('SUM(m.kwhConsumedAc)', 'total')
      .where('m.timestamp > :since', { since })
      .getRawOne();

    return {
      acConsumed: Number(ac.total || 0),
      dcDelivered: Number(dc.total || 0),
      efficiency: dc.total && ac.total ? dc.total / ac.total : 0,
      avgBatteryTemp: Number(dc.avgTemp || 0)
    };
  }
}
