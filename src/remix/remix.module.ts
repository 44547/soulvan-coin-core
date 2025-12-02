import { Module } from '@nestjs/common';
import { RemixController } from './remix.controller';
import { RemixService } from './remix.service';

@Module({
  controllers: [RemixController],
  providers: [RemixService],
  exports: [RemixService],
})
export class RemixModule {}
