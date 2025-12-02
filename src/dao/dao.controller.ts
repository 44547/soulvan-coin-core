import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CastVoteDto } from './dto/cast-vote.dto';
import { TonSignatureGuard } from '../auth/ton.guard';

// Minimal in-memory vote service
class VoteService {
  private votes: any[] = [];
  async castVote(dto: CastVoteDto) {
    const vote = { id: `${this.votes.length + 1}`, ...dto, weight: 100, castAt: new Date().toISOString() };
    this.votes.push(vote);
    return vote;
  }
}

@Controller()
export class DaoController {
  private voteService = new VoteService();

  @UseGuards(TonSignatureGuard)
  @Post('dao/votes')
  cast(@Body() dto: CastVoteDto) {
    return this.voteService.castVote(dto);
  }
}
