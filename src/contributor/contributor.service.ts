import { Injectable } from '@nestjs/common';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { IdentityMethod } from '../common/dto/shared.dto';

export interface ContributorRes {
  id: string;
  walletAddress: string;
  chain: string;
  username: string;
  prestigeScore: number;
  identityMethod: IdentityMethod;
  photoHash?: string;
  socialHandle?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ContributorService {
  private readonly items: ContributorRes[] = [];

  async create(dto: CreateContributorDto): Promise<ContributorRes> {
    if (dto.identityMethod === IdentityMethod.PHOTO && !dto.photoHash) {
      throw new Error('photoHash required for PHOTO identity');
    }
    const now = new Date().toISOString();
    const contributor: ContributorRes = {
      id: `${this.items.length + 1}`,
      walletAddress: dto.walletAddress,
      chain: dto.chain,
      username: dto.username,
      prestigeScore: 0,
      identityMethod: dto.identityMethod,
      photoHash: dto.photoHash,
      socialHandle: dto.socialHandle,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(contributor);
    return contributor;
  }

  async findAll(): Promise<ContributorRes[]> {
    return this.items;
  }
}
