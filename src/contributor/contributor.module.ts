import { Module } from '@nestjs/common';
import { ContributorController } from './contributor.controller';
import { ContributorService } from './contributor.service';

@Module({
  controllers: [ContributorController],
  providers: [ContributorService],
  exports: [ContributorService],
})
export class ContributorModule {}
