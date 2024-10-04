// import { Expose } from 'class-transformer';
import {
  IsEmail,
  // IsEmail,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(6, 255, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
}
