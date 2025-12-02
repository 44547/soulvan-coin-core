import { Injectable } from '@nestjs/common';

@Injectable()
export class PrestigeService {
  constructor(
    private readonly repo: any,
    private readonly ton: { getBalance: (wallet: string) => Promise<number> },
  ) {}

  async updateScore(contributorId: string, delta: number): Promise<number> {
    const contributor = await this.repo.findById(contributorId);
    contributor.prestigeScore += delta;
    await this.repo.save(contributor);
    return contributor.prestigeScore;
  }

  async getVotingWeight(contributorId: string): Promise<number> {
    const contributor = await this.repo.findById(contributorId);
    const balance = await this.ton.getBalance(contributor.walletAddress);
    return balance + contributor.prestigeScore * 10;
  }
}
