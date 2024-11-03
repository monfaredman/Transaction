import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
  }
  async createUser(createDto: CreateUserDto) {
    const { mobile } = createDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      user = this.userRepository.create(createDto);
      await this.userRepository.save(user);
    }
    return user;
  }
}
