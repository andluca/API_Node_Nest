import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthSeedService {
  private readonly logger = new Logger(AuthSeedService.name);

  constructor(private readonly authRepository: AuthRepository) {}

  async createDefaultAdmin(): Promise<void> {
    try {
      const adminExists =
        await this.authRepository.emailExists('admin@admin.com');
      if (adminExists) {
        this.logger.log('Usuário admin já existe');
        return;
      }

      const defaultPassword = 'Admin123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      const adminAuth = {
        email: 'admin@admin.com',
        password: hashedPassword,
        isActive: true,
      };

      await this.authRepository.create(adminAuth);

      this.logger.log('Usuário admin criado com sucesso!');
      this.logger.log('Email: admin@admin.com');
      this.logger.log('Senha: Admin123!');
    } catch (error) {
      this.logger.error('Erro ao criar usuário admin:', error);
      throw error;
    }
  }
}
