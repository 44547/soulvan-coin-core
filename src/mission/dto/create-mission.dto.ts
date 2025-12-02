import { ArrayMaxSize, IsArray, IsEnum, IsISO8601, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { RemixType } from '../../common/dto/shared.dto';

export class CreateMissionDto {
  @IsString()
  @MinLength(4)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(16)
  @MaxLength(1000)
  description: string;

  @IsEnum(RemixType)
  remixType: RemixType;

  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  tags: string[];

  @IsISO8601()
  startAt: string;

  @IsISO8601()
  endAt: string;

  @IsOptional()
  @IsString()
  region?: string;
}
