import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '../../common/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
