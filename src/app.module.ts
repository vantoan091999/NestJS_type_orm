import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserEntity } from './entity/user.entity';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
// import { SchoolEntity } from './entity/school.entity';
import { SchoolModule } from './school/school.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
// import { EnterprisesEntity } from './entity/enterprises.entity';
import { EnterprisesModule } from './enterprises/enterprises.module';
import { NewModule } from './new/new.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'kakashi99',
      database: 'type-orm-db',
      migrations: ['dist/db/migrations/*.js'],
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    SchoolModule,
    EnterprisesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
