import { BadRequestException } from '@nestjs/common';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Chain, IdentityMethod } from '../../common/dto/shared.dto';

export class CreateContributorDto {
  @IsString()
  @MinLength(10)
  walletAddress: string;

  @IsEnum(Chain)
  chain: Chain;

  @IsString()
  @Matches(/^[a-z0-9_-]{3,32}$/)
  username: string;

  @IsEnum(IdentityMethod)
  identityMethod: IdentityMethod;

  @IsOptional()
  @IsString()
  photoHash?: string;

  @IsOptional()
  @IsString()
  @Matches(/^@?[A-Za-z0-9_.]{2,32}$/)
  socialHandle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  bio?: string;

  static validateIdentity(dto: CreateContributorDto) {
    if (dto.identityMethod === IdentityMethod.PHOTO && !dto.photoHash) {
      throw new BadRequestException('photoHash required for PHOTO identity');
    }
  }
}
