import { IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @MinLength(4)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(16)
  @MaxLength(1000)
  summary: string;

  @IsOptional()
  @IsString()
  metadataUri?: string;

  @IsISO8601()
  startAt: string;

  @IsISO8601()
  endAt: string;
}
