import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UseDto } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { DataSource } from 'typeorm';
export class UserDtoData {
  data: UseDto[];
  total: number;
  page: number;
  lastPage: number;
}
export class LoginResponseDto {
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'login' })
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<LoginResponseDto> {
    const user = await this.userService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const tokenResponse = await this.userService.login(body);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: tokenResponse.accessToken,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(JwtAuthGuard)
  @Roles('user')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<UserDtoData> {
    try {
      return await this.userService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @ApiBody({ type: UseDto })
  // @UseGuards(JwtAuthGuard)
  // @Roles('user')
  @ApiOperation({ summary: 'Create a user' })
  async create(@Body() user: UseDto): Promise<UseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    // Bắt đầu transaction
    await queryRunner.startTransaction();
    try {
      const savedUser = this.userService.save(user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() user: UseDto,
  ): Promise<UseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const updateUser = await this.userService.update(id, user);
      await queryRunner.commitTransaction();
      return updateUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  // DELETE - Xóa user theo ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user by ID' })
  async remove(@Param('id') id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const deleteUser = await this.userService.remove(id);
      await queryRunner.commitTransaction();
      return deleteUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } finally {
      await queryRunner.release();
    }
  }
}
