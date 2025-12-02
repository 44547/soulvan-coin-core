import { Injectable } from '@nestjs/common';
import { CreateRemixDto } from './dto/create-remix.dto';
import { AssetKind } from '../common/dto/shared.dto';

export interface RemixRes {
  id: string;
  contributorId: string;
  originAssetId: string;
  remixType: string;
  remixHash: string;
  originHash: string;
  originalityScore: number;
  timestamp: string;
  description?: string;
  tags?: string[];
  kind: AssetKind;
}

@Injectable()
export class RemixService {
  private readonly items: RemixRes[] = [];

  async create(dto: CreateRemixDto): Promise<RemixRes> {
    const originalityScore = Math.floor(Math.random() * 101);
    const remix: RemixRes = {
      id: `${this.items.length + 1}`,
      contributorId: dto.contributorId,
      originAssetId: dto.originAssetId,
      remixType: dto.remixType,
      remixHash: dto.remixHash,
      originHash: dto.originHash,
      originalityScore,
      timestamp: new Date().toISOString(),
      description: dto.description,
      tags: dto.tags,
      kind: AssetKind.REMIX,
    };
    this.items.push(remix);
    return remix;
  }

  async findAll(): Promise<RemixRes[]> {
    return this.items;
  }
}
