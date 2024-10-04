import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { UseDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
export class UserDtoData {
  data: UseDto[];
  total: number;
  page: number;
  lastPage: number;
}

@Injectable()
export class UserService {
  /******  47790973-3faf-4089-a7eb-32fd23dcd09b  *******/ constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // Phương thức remove: Xóa user theo ID
  async remove(id: string): Promise<void> {
    const userId = Number(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    await this.userRepository.delete(id);
    // return 'User has been successfully deleted.';
  }
  async findAll(page: number = 1, limit: number = 10): Promise<UserDtoData> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: plainToInstance(UseDto, users),
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(email: string, param: string | number): Promise<UseDto> {
    const attr = email;
    const user = await this.userRepository.findOne({
      where: { [attr]: param },
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return plainToInstance(UseDto, user);
  }

  async save(user: UseDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const saltRounds = 10; // Số vòng để tạo salt
    user.password = await bcrypt.hash(user.password, saltRounds);
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async update(id: string, updatedUser: UseDto): Promise<UserEntity> {
    const userId = Number(id);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const emailExists = await this.userRepository.findOne({
      where: { email: updatedUser.email, id: Not(userId) },
    });
    if (emailExists) {
      throw new BadRequestException('Email đã tồn tại');
    }
    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updatedUser.password, 10); // Mã hóa mật khẩu mới
    }

    await this.userRepository.update(id, updatedUser);
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    return user;
  }

  async login(userDto: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordMatching = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate a JWT token
      const payload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
      });

      return { accessToken };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Login failed');
    }
  }
}
