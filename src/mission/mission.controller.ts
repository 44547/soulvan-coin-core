import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { SubmitMissionEntryDto } from './dto/submit-mission-entry.dto';
import { TonSignatureGuard } from '../auth/ton.guard';

@Controller()
export class MissionController {
  constructor(private readonly service: MissionService) {}

  @UseGuards(TonSignatureGuard)
  @Post('missions')
  createMission(@Body() dto: CreateMissionDto) {
    return this.service.createMission(dto);
  }

  @UseGuards(TonSignatureGuard)
  @Post('missions/:id/entries')
  submitEntry(@Param('id') missionId: string, @Body() dto: SubmitMissionEntryDto) {
    return this.service.submitEntry({ ...dto, missionId });
  }
}
