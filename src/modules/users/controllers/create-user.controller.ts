import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserService } from '../services/create-user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    schema: {
      type: 'object',
      required: ['name', 'cpf', 'birthDate'],
      properties: {
        name: { type: 'string', example: 'Lucas Galindo' },
        gender: {
          type: 'string',
          maxLength: 1,
          enum: ['M', 'F'],
          nullable: true,
          example: 'M',
        },
        email: {
          type: 'string',
          format: 'email',
          nullable: true,
          example: 'email@email.com',
        },
        birthDate: { type: 'string', format: 'date', example: '2004-11-30' },
        placeOfBirth: {
          type: 'string',
          nullable: true,
          example: 'São José do Rio Preto',
        },
        nationality: { type: 'string', nullable: true, example: 'Brasileiro' },
        cpf: { type: 'string', pattern: '^\\d{11}$', example: '47047368817' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        message: 'Usuário criado com sucesso',
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
  @ApiBadRequestResponse({ description: 'Payload inválido' })
  @ApiConflictResponse({ description: 'CPF ou e-mail já cadastrado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
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
