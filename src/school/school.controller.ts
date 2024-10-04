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
  UseGuards,
} from '@nestjs/common';
import { SchoolDto } from './dto/school.dto';
import { SchoolService } from './school.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DataSource } from 'typeorm'; // Import DataSource để sử dụng transaction

export class SchoolDtoData {
  data: SchoolDto[];
  total: number;
  page: number;
  lastPage: number;
}

@ApiTags('schools')
@Controller('schools')
export class SchoolController {
  constructor(
    private readonly schoolService: SchoolService,
    private readonly dataSource: DataSource, // Inject DataSource để sử dụng transaction
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all schools' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<SchoolDtoData> {
    try {
      return this.schoolService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @ApiBody({ type: SchoolDto })
  @ApiOperation({ summary: 'Create a school' })
  async create(@Body() schoolDto: SchoolDto): Promise<SchoolDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Kết nối đến DB
    await queryRunner.startTransaction(); // Bắt đầu transaction

    try {
      const createdSchool = await this.schoolService.create(schoolDto); // Gọi phương thức create mà không sử dụng manager
      await queryRunner.commitTransaction(); // Commit transaction nếu thành công
      return createdSchool;
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback nếu gặp lỗi
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release(); // Giải phóng QueryRunner
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a school by ID' })
  async update(
    @Param('id') id: number,
    @Body() schoolDto: SchoolDto,
  ): Promise<SchoolDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Kết nối đến DB
    await queryRunner.startTransaction(); // Bắt đầu transaction

    try {
      const updatedSchool = await this.schoolService.update(id, schoolDto); // Gọi phương thức update mà không sử dụng manager
      await queryRunner.commitTransaction(); // Commit transaction nếu thành công
      return updatedSchool;
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback nếu gặp lỗi
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release(); // Giải phóng QueryRunner
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a school by ID' })
  async delete(@Param('id') id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Kết nối đến DB
    await queryRunner.startTransaction(); // Bắt đầu transaction

    try {
      await this.schoolService.delete(id); // Gọi phương thức delete mà không sử dụng manager
      await queryRunner.commitTransaction(); // Commit transaction nếu thành công
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback nếu gặp lỗi
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } finally {
      await queryRunner.release(); // Giải phóng QueryRunner
    }
  }
}
