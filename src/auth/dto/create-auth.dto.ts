import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from 'src/user/user.role';

export class CreateAuthDto {
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
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', description: 'Password of the user' })
  @IsNotEmpty()
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
  @ApiProperty({ type: 'string', default: new Date() })
  @IsString()
  createdAt: Date;
  @IsEnum({ user: UserRole.USER, admin: UserRole.ADMIN })
  @ApiProperty({ default: 'USER', description: 'role of the user' })
  role: UserRole;
}
