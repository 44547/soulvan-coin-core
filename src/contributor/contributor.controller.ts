import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { CreateContributorDto } from './dto/create-contributor.dto';
import { TonSignatureGuard } from '../auth/ton.guard';

@Controller()
export class ContributorController {
  constructor(private readonly service: ContributorService) {}

  @UseGuards(TonSignatureGuard)
  @Post('contributors')
  create(@Body() dto: CreateContributorDto) {
    return this.service.create(dto);
  }

  @Get('contributors')
  findAll() {
    return this.service.findAll();
  }
}
