import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginoginAuthDto } from './dto/login-auth.dto';
import { LogOutAuthDto } from './dto/logout-auth.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({ description: 'Registered successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid data entered!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @ApiOkResponse({ description: 'Logged in succedfully!' })
  @ApiBadRequestResponse({ description: 'Invalid data entered!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Post('login')
  login(
    @Body() loginoginAuthDto: LoginoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(
      loginoginAuthDto.email,
      loginoginAuthDto.password,
      res,
    );
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Successfully returned!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Get('me')
  getMyInfo(@Req() req: any) {
    return this.authService.usersMe(req);
  }

  @ApiOkResponse({ description: 'Successfully logged out!' })
  @ApiBadRequestResponse({ description: 'Invalid data entered!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOkResponse({ description: 'Successfully refreshed!' })
  @ApiBadRequestResponse({ description: 'Invalid data entered!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh(req);
  }
}
