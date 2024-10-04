import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
// import { IsEmailUnique } from './validators/IsEmailUnique';

export class UseDto {
  // @Expose()
  // id?: number;
  @Expose()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @Length(1, 100, { message: 'Tên phải có độ dài từ 1 đến 100 ký tự' })
  name: string;

  @Expose()
  @IsNotEmpty({ message: 'Email không được để trống' })
  // @IsEmailUnique({ message: 'Email đã tồn tại' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Email không hợp lệ',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(6, 255, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
  // @Expose()
  // is_actived?: string;
}
