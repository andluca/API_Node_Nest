import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class FindUserByIdService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
