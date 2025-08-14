import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindUserByIdService } from '../services/find-user-by-id.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class FindUserByIdController {
  constructor(private readonly findUserByIdService: FindUserByIdService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', format: 'uuid' })
  @ApiOkResponse({
    description: 'Usuário encontrado com sucesso',
    schema: {
      example: {
        message: 'Usuário encontrado com sucesso',
        data: {
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
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.findUserByIdService.execute(id);
    return {
      message: 'Usuário encontrado com sucesso',
      data: user,
    };
  }
}
