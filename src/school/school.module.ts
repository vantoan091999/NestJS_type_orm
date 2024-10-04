import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity } from 'src/entity/school.entity';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [TypeOrmModule.forFeature([SchoolEntity])],
})
export class SchoolModule {}
