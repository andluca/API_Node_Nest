import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeleteUserService } from '../services/delete-user.service';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', format: 'uuid' })
  @ApiNoContentResponse({ description: 'Usuário removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteUserService.execute(id);
  }
}
