import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { RemixType } from '../../common/dto/shared.dto';

export class SubmitMissionEntryDto {
  @IsUUID()
  contributorId: string;

  @IsUUID()
  missionId: string;

  @IsString()
  remixHash: string;

  @IsString()
  originHash: string;

  @IsEnum(RemixType)
  remixType: RemixType;

  @IsOptional()
  @IsString()
  description?: string;
}
