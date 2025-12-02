import { ArrayMaxSize, IsArray, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { RemixType } from '../../common/dto/shared.dto';

export class CreateRemixDto {
  @IsUUID()
  contributorId: string;

  @IsUUID()
  originAssetId: string;

  @IsEnum(RemixType)
  remixType: RemixType;

  @IsString()
  @MinLength(10)
  remixHash: string;

  @IsString()
  @MinLength(10)
  originHash: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MinLength(2, { each: true })
  @MaxLength(24, { each: true })
  tags?: string[];
}
