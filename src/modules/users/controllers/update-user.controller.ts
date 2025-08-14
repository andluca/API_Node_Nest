import { Controller, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserService } from '../services/update-user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
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
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', format: 'uuid' })
  @ApiBody({
    type: UpdateUserDto,
    required: true,
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', example: 'Lucas Atualizado' },
        gender: {
          type: 'string',
          maxLength: 1,
          enum: ['M', 'F'],
          example: 'M',
        },
        email: { type: 'string', format: 'email', example: 'email@email.com' },
        birthDate: { type: 'string', format: 'date', example: '2004-11-30' },
        placeOfBirth: { type: 'string', example: 'São José do Rio Preto' },
        nationality: { type: 'string', example: 'Brasileiro' },
        cpf: { type: 'string', pattern: '^\\d{11}$', example: '47047368817' },
      },
      example: {
        name: 'Lucas Atualizado',
        email: 'novo@email.com',
        birthDate: '2004-11-30',
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        message: 'Usuário atualizado com sucesso',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Lucas Atualizado',
          gender: 'M',
          email: 'email@email.com',
          birthDate: '2004-11-30',
          placeOfBirth: 'São José do Rio Preto',
          nationality: 'Brasileiro',
          cpf: '47047368817',
          createdAt: '2025-08-13T15:00:00.000Z',
          updatedAt: '2025-08-14T10:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Payload inválido' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userData = {
      ...updateUserDto,
      birthDate: updateUserDto.birthDate
        ? new Date(updateUserDto.birthDate)
        : undefined,
    };
    const user = await this.updateUserService.execute(id, userData);
    return {
      message: 'Usuário atualizado com sucesso',
      data: user,
    };
  }
}
