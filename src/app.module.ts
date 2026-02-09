import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestModule } from './ingest/ingest.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'evuser',
      password: 'evpass',
      database: 'evdb',
      autoLoadEntities: true,
      synchronize: true
    }),
    IngestModule,
    AnalyticsModule
  ],
})
export class AppModule {}
