import { Module } from '@nestjs/common';
import { ContributorModule } from './contributor/contributor.module';
import { RemixModule } from './remix/remix.module';
import { DaoModule } from './dao/dao.module';
import { MissionModule } from './mission/mission.module';

@Module({
  imports: [ContributorModule, RemixModule, DaoModule, MissionModule],
})
export class AppModule {}
