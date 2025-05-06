import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    return this.userService.create(createAuthDto);
  }
  async login(email: string, pass: string, res: Response) {
    const user = await this.userService.validateUser(email, pass);

    const payload = {
      id: user.id!,
      role: user.role,
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    });

    res.cookie('jwt', refreshToken, {
      maxAge: 3600000,
      httpOnly: false,
    });

    return await this.userService.update(user.id!, {
      refreshToken: refreshToken,
    } as UpdateUserDto);
  }
  async refresh(req: Request) {
    const token = req.cookies.jwt;
    try {
      const validation = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      const user = await this.userService.findOne(validation.id);
      console.log(user);
      if (!user[0]) throw new NotFoundException('User not found!');

      const payload = {
        id: user[0].id,
        role: user[0].role,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: process.env.ACCESS_TOKEN_EXP,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  async usersMe(req: Request) {
    const token = req.cookies.jwt;
    try {
      const validation = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      const user = await this.userService.findOne(validation.id);
      console.log(user);
      if (!user[0]) throw new NotFoundException('User not found!');

      return user[0];
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  async logout(res: Response) {
    res.clearCookie('jwt', { maxAge: 3600000, httpOnly: false });
    return 'Successfully logged out!';
  }
}
