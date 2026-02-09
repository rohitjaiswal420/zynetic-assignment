import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { MeterReading, VehicleReading, MeterLive, VehicleLive } from '../models/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading, VehicleReading, MeterLive, VehicleLive])],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
