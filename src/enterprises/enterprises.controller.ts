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
import { EnterprisesDto } from './dto/Enterprises.dto';
import { EnterprisesService } from './Enterprises.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
export class EnterprisesDtoData {
  data: EnterprisesDto[];
  total: number;
  page: number;
  lastPage: number;
}
@ApiTags('Enterprisess')
@Controller('Enterprisess')
export class EnterprisesController {
  userService: any;
  constructor(private readonly EnterprisesService: EnterprisesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Enterprises' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<EnterprisesDtoData> {
    try {
      return this.EnterprisesService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @ApiBody({ type: EnterprisesDto })
  @ApiOperation({ summary: 'Create a Enterprises' })
  async create(
    @Body() EnterprisesDto: EnterprisesDto,
  ): Promise<EnterprisesDto> {
    try {
      return this.EnterprisesService.create(EnterprisesDto);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // Sửa thông tin trường
  @Put(':id')
  @ApiOperation({ summary: 'Update a Enterprises by ID' })
  async update(
    @Param('id') id: number,
    @Body() EnterprisesDto: EnterprisesDto,
  ): Promise<EnterprisesDto> {
    try {
      return this.EnterprisesService.update(id, EnterprisesDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Xóa trường
  @Delete(':id')
  @ApiOperation({ summary: 'delete a Enterprises by ID' })
  async delete(@Param('id') id: number): Promise<void> {
    try {
      return this.EnterprisesService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
