import { Controller, Put, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserService } from '../services/update-user.service';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Put(':id')
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
