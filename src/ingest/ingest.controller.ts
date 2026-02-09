import { Controller, Post, Body } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly service: IngestService) {}

  @Post()
  ingest(@Body() body: any) {
    return this.service.ingest(body);
  }
}
