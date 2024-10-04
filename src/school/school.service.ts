import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { SchoolDto } from './dto/School.dto';
import { plainToInstance } from 'class-transformer';
import { SchoolEntity } from 'src/entity/school.entity';
export class SchoolDtoData {
  data: SchoolDto[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<SchoolDtoData> {
    const [school, total] = await this.schoolRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: plainToInstance(SchoolDto, school),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Thêm trường mới
  async create(schoolDto: SchoolDto): Promise<SchoolDto> {
    const existingSchool = await this.schoolRepository.findOne({
      where: { email: schoolDto.email },
    });
    if (existingSchool) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const school = this.schoolRepository.create(schoolDto);
    return this.schoolRepository.save(school);
  }

  // Sửa thông tin trường
  async update(id: number, schoolDto: SchoolDto): Promise<SchoolDto> {
    const school = await this.schoolRepository.findOne({
      where: { id: id },
    });
    if (!school) {
      throw new BadRequestException('User not found');
    }
    const existingSchool = await this.schoolRepository.findOne({
      where: { email: schoolDto.email, id: Not(id) },
    });
    if (existingSchool) {
      throw new BadRequestException('Email đã tồn tại');
    }
    await this.schoolRepository.update(schoolDto.updateId, schoolDto);
    return this.schoolRepository.findOne({ where: { id: schoolDto.updateId } });
  }

  // Xóa trường
  async delete(id: number): Promise<void> {
    const school = await this.schoolRepository.findOne({ where: { id } });
    if (!school) {
      throw new NotFoundException('School không tồn tại');
    }
    await this.schoolRepository.delete(id);
  }
}
