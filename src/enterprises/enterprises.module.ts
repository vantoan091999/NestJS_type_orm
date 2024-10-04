import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnterprisesEntity } from 'src/entity/enterprises.entity';
import { EnterprisesController } from './enterprises.controller';
import { EnterprisesService } from './Enterprises.service';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
  imports: [TypeOrmModule.forFeature([EnterprisesEntity])],
})
export class EnterprisesModule {}
