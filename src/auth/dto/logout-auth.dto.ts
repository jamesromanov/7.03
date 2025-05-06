import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogOutAuthDto {
  @ApiProperty({ default: 'someonpe@gmail.com', type: 'string' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ default: 'some_password', type: 'string' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
