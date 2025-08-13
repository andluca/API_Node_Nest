import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user.service';

@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const userData = {
      ...createUserDto,
      birthDate: new Date(createUserDto.birthDate),
    };
    const user = await this.createUserService.execute(userData);
    return {
      message: 'Usuário criado com sucesso',
      data: user,
    };
  }
}
