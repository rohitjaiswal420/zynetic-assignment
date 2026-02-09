import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterReading, VehicleReading, MeterLive, VehicleLive } from '../models/entities';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(MeterReading) private meterRepo: Repository<MeterReading>,
    @InjectRepository(VehicleReading) private vehicleRepo: Repository<VehicleReading>,
    @InjectRepository(MeterLive) private meterLiveRepo: Repository<MeterLive>,
    @InjectRepository(VehicleLive) private vehicleLiveRepo: Repository<VehicleLive>,
  ) {}

  async ingest(payload: any) {
    if (payload.meterId) {
      await this.meterRepo.save(payload);
      await this.meterLiveRepo.save({ meterId: payload.meterId, ...payload });
      return { status: 'meter_ingested' };
    }

    if (payload.vehicleId) {
      await this.vehicleRepo.save(payload);
      await this.vehicleLiveRepo.save({ vehicleId: payload.vehicleId, ...payload });
      return { status: 'vehicle_ingested' };
    }

    throw new BadRequestException('Invalid telemetry payload');
  }
}
