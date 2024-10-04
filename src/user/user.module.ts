import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
// import { IsEmailUniqueConstraint } from './validators/IsEmailUnique';

@Module({
  controllers: [UserController],
  providers: [UserService, JwtService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
