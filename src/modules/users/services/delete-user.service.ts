import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    this.validateId(id);

    await this.validateUserExists(id);

    await this.userRepository.delete(id);
  }

  private validateId(id: string): void {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID do usuário é obrigatório');
    }
  }

  private async validateUserExists(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
