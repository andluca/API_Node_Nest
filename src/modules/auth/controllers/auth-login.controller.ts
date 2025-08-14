import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthLoginService, LoginResponse } from '../service/auth-login.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { IsPublic } from 'src/shared/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthLoginController {
  constructor(private readonly authLoginService: AuthLoginService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica usuário e retorna token JWT' })
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({
    description: 'Autenticado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@admin.com',
            },
            isActive: { type: 'boolean', example: true },
          },
        },
      },
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'admin@admin.com',
          isActive: true,
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Payload inválido' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async login(@Body() loginDto: AuthLoginDto): Promise<LoginResponse> {
    return await this.authLoginService.execute(
      loginDto.email,
      loginDto.password,
    );
  }
}
