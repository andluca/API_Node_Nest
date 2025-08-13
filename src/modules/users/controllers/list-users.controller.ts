import { Controller, Get } from '@nestjs/common';
import { ListUsersService } from '../services/list-users.service';

@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  async findAll() {
    const users = await this.listUsersService.execute();
    return {
      message: 'Usuários listados com sucesso',
      data: users,
      total: users.length,
    };
  }
}
