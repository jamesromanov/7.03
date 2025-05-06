import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Res,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserRole } from './user.role';
import { Roles } from './roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/auth.role.guard';
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({ description: 'Succesfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid data!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: 'Successfully returned!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(UserRole.USER)
  @ApiBadRequestResponse({ description: 'Invalid id!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @ApiOkResponse({ description: 'Succesfully returned!' })
  @ApiNotFoundResponse({ description: 'User not found!' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({ description: 'Updated successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid id!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
  @Roles(UserRole.ADMIN)
  @ApiBadRequestResponse({ description: 'Invalid id!' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error!' })
  @ApiNoContentResponse({ description: 'Succesfully deleted!' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
