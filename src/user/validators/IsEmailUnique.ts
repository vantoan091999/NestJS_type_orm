import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    const userId = (args.object as any).id; // Lấy id từ DTO để loại trừ email của user hiện tại
    const user = await this.userRepository.findOne({
      where: userId ? { email, id: Not(userId) } : { email },
    });
    return !user; // Trả về `true` nếu email không tồn tại, ngược lại là `false`
  }

  defaultMessage(): string {
    return 'Email đã tồn tại.';
  }
}

// Định nghĩa hàm decorator để sử dụng trong DTO
export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}
