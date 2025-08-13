import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindUserByIdService } from '../services/find-user-by-id.service';

@Controller('users')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.findUserByIdService.execute(id);
    return {
      message: 'Usuário encontrado com sucesso',
      data: user,
    };
  }
}
