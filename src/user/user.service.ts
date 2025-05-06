import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginoginAuthDto } from 'src/auth/dto/login-auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepo.create(createUserDto);
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.driverError.detail);
    }
  }

  async findAll() {
    const users = this.userRepo.find();
    return await users;
  }

  async findOne(id: number) {
    if (id < 1) throw new BadRequestException('invalid id!');
    const user = await this.userRepo.findBy({ id });
    if (user.length === 0) throw new NotFoundException('User not found!');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (id < 1) throw new BadRequestException('Id is invalid!');
    const user = (await this.userRepo.findBy({ id }))[0];
    if (!user) throw new NotFoundException('User not found!');
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    if (id < 1) throw new BadRequestException('Id is invalid!');
    const user = (await this.userRepo.findBy({ id }))[0];
    if (!user) throw new NotFoundException('User not found!');
    await this.userRepo.remove(user);
    return;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'refreshToken', 'createdAt', 'password', 'name'],
    });

    if (!user) throw new NotFoundException('User not found!');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Password is invalid!');

    return user;
  }
}
