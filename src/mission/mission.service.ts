import { Injectable } from '@nestjs/common';
import { RemixType } from '../common/dto/shared.dto';
import { PrestigeService } from '../prestige/prestige.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { SubmitMissionEntryDto } from './dto/submit-mission-entry.dto';

export interface MissionRes {
  id: string;
  title: string;
  description: string;
  remixType: RemixType;
  tags: string[];
  startAt: string;
  endAt: string;
  status: 'ACTIVE' | 'CLOSED';
  region?: string;
}

export interface MissionEntryRes {
  id: string;
  missionId: string;
  contributorId: string;
  remixHash: string;
  originHash: string;
  originalityScore: number;
  prestigeImpact: number;
  description?: string;
}

interface MissionRepository {
  create(data: CreateMissionDto & { status: 'ACTIVE' | 'CLOSED' }): Promise<MissionRes>;
  createEntry(data: SubmitMissionEntryDto & { originalityScore: number; prestigeImpact: number }): Promise<MissionEntryRes>;
}

interface OriginalityEngine {
  computeOriginality(originHash: string, remixHash: string): Promise<number>;
}

@Injectable()
export class MissionService {
  constructor(
    private readonly repo: MissionRepository,
    private readonly ai: OriginalityEngine,
    private readonly scoring: PrestigeScoring,
    private readonly prestige: PrestigeService,
    private readonly replay: ReplayService,
    private readonly events: { emit: (event: string, payload: unknown) => void },
  ) {}

  async createMission(dto: CreateMissionDto): Promise<MissionRes> {
    const mission = await this.repo.create({ ...dto, status: 'ACTIVE' });
    this.events.emit('mission.created', mission);
    return mission;
  }

  async submitEntry(dto: SubmitMissionEntryDto): Promise<MissionEntryRes> {
    const originalityScore = await this.ai.computeOriginality(dto.originHash, dto.remixHash);
    const prestigeImpact = this.scoring.calculateImpact(originalityScore, dto.remixType);
    const entry = await this.repo.createEntry({ ...dto, originalityScore, prestigeImpact });
    await this.prestige.updateScore(dto.contributorId, prestigeImpact);
    this.replay.emitRemixReplay(dto.remixHash);
    return entry;
  }
}

@Injectable()
export class ReplayService {
  constructor(
    private readonly analytics: { track: (event: string, payload: Record<string, unknown>) => void },
    private readonly codexViewer: { updateLineage: (remixHash: string) => void },
  ) {}

  emitRemixReplay(remixHash: string) {
    this.analytics.track('remix.replay', { remixHash });
    this.codexViewer.updateLineage(remixHash);
  }
}

@Injectable()
export class PrestigeScoring {
  calculateImpact(originality: number, type: RemixType): number {
    const base = originality * 10;
    const multiplier =
      type === RemixType.VISUAL ? 1.2 : type === RemixType.AUDIO ? 1.5 : 1.0;
    return Math.round(base * multiplier);
  }
}
