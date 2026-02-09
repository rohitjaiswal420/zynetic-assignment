import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('performance/:vehicleId')
  performance(@Param('vehicleId') vehicleId: string) {
    return this.service.performance(vehicleId);
  }
}
