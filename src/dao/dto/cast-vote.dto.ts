import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { VoteChoice } from '../../common/dto/shared.dto';

export class CastVoteDto {
  @IsUUID()
  proposalId: string;

  @IsUUID()
  contributorId: string;

  @IsEnum(VoteChoice)
  choice: VoteChoice;

  @IsOptional()
  @IsNumber()
  weightOverride?: number;
}
