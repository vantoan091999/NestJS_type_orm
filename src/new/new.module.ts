import { Module } from '@nestjs/common';
import { NewService } from './new.service';
import { NewController } from './new.controller';

@Module({
  controllers: [NewController],
  providers: [NewService],
})
export class NewModule {}
