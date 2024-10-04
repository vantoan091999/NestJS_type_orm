import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'ID người dùng là bắt buộc.' })
  id: number;
}
export class SchoolDto {
  @IsNotEmpty({ message: 'Tên trường là bắt buộc.' })
  name: string;

  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc.' })
  phone: string;

  @IsEmail({}, { message: 'Địa chỉ email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email là bắt buộc.' })
  email: string;

  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  user?: UserDto;

  @IsOptional()
  updateId?: number;

  @IsOptional()
  deleteId?: number;
}
