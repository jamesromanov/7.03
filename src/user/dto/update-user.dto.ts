import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from '../user.role';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    type: 'string',
    default: 'somone',
    description: 'name of the user',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: 'string',
    default: 'somone@gmail.com',
    description: 'email of the user',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', description: 'Password of the user' })
  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @IsOptional()
  @IsString()
  refreshToken: string;
  @IsString()
  @ApiProperty({ default: UserRole.USER, description: 'role of the user' })
  @IsEnum({ user: UserRole.USER, admin: UserRole.ADMIN })
  role: UserRole;
}
