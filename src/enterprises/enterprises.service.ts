import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EnterprisesDto } from './dto/enterprises.dto';
import { plainToInstance } from 'class-transformer';
import { EnterprisesEntity } from 'src/entity/Enterprises.entity';
export class EnterprisesDtoData {
  data: EnterprisesDto[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class EnterprisesService {
  constructor(
    @InjectRepository(EnterprisesEntity)
    private EnterprisesRepository: Repository<EnterprisesEntity>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<EnterprisesDtoData> {
    const [Enterprises, total] = await this.EnterprisesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: plainToInstance(EnterprisesDto, Enterprises),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // Thêm trường mới
  async create(EnterprisesDto: EnterprisesDto): Promise<EnterprisesDto> {
    const existingEnterprises = await this.EnterprisesRepository.findOne({
      where: { email: EnterprisesDto.email },
    });
    if (existingEnterprises) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const Enterprises = this.EnterprisesRepository.create(EnterprisesDto);
    return this.EnterprisesRepository.save(Enterprises);
  }

  // Sửa thông tin trường
  async update(
    id: number,
    EnterprisesDto: EnterprisesDto,
  ): Promise<EnterprisesDto> {
    const Enterprises = await this.EnterprisesRepository.findOne({
      where: { id: id },
    });
    if (!Enterprises) {
      throw new BadRequestException('User not found');
    }
    const existingEnterprises = await this.EnterprisesRepository.findOne({
      where: { email: EnterprisesDto.email, id: Not(id) },
    });
    if (existingEnterprises) {
      throw new BadRequestException('Email đã tồn tại');
    }
    await this.EnterprisesRepository.update(
      EnterprisesDto.updateId,
      EnterprisesDto,
    );
    return this.EnterprisesRepository.findOne({
      where: { id: EnterprisesDto.updateId },
    });
  }

  // Xóa trường
  async delete(id: number): Promise<void> {
    const Enterprises = await this.EnterprisesRepository.findOne({
      where: { id },
    });
    if (!Enterprises) {
      throw new NotFoundException('Enterprises không tồn tại');
    }
    await this.EnterprisesRepository.delete(id);
  }
}
