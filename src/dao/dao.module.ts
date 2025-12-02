import { Module } from '@nestjs/common';
import { DaoController } from './dao.controller';

@Module({
  controllers: [DaoController],
})
export class DaoModule {}
