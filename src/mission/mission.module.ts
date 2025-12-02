import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService, ReplayService, PrestigeScoring } from './mission.service';
import { PrestigeService } from '../prestige/prestige.service';

// Note: repo/ai/events dependencies would be provided via actual providers in a full app
@Module({
  controllers: [MissionController],
  providers: [MissionService, ReplayService, PrestigeScoring, PrestigeService],
})
export class MissionModule {}
