import { Controller, Get } from '@nestjs/common';
import { ListUsersService } from '../services/list-users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiOkResponse({
    description: 'Lista retornada com sucesso',
    schema: {
      example: {
        message: 'Usuários listados com sucesso',
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Lucas Galindo',
            gender: 'M',
            email: 'email@email.com',
            birthDate: '2004-11-30',
            placeOfBirth: 'São José do Rio Preto',
            nationality: 'Brasileiro',
            cpf: '47047368817',
            createdAt: '2025-08-13T15:00:00.000Z',
            updatedAt: '2025-08-13T15:00:00.000Z',
          },
        ],
        total: 1,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async findAll() {
    const users = await this.listUsersService.execute();
    return {
      message: 'Usuários listados com sucesso',
      data: users,
      total: users.length,
    };
  }
}
