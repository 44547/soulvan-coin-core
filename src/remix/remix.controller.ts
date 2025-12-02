import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RemixService } from './remix.service';
import { CreateRemixDto } from './dto/create-remix.dto';
import { TonSignatureGuard } from '../auth/ton.guard';

@Controller()
export class RemixController {
  constructor(private readonly service: RemixService) {}

  @UseGuards(TonSignatureGuard)
  @Post('remixes')
  create(@Body() dto: CreateRemixDto) {
    return this.service.create(dto);
  }

  @Get('remixes')
  findAll() {
    return this.service.findAll();
  }
}
