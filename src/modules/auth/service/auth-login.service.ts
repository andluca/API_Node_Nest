import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from '../entities/auth.entity';
import { AuthRepository } from '../repository/auth.repository';
import * as bcrypt from 'bcryptjs';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    isActive: boolean;
  };
}

@Injectable()
export class AuthLoginService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<LoginResponse> {
    this.validateLoginData(email, password);

    const auth = await this.findAuthByEmail(email);

    await this.validatePassword(password, auth.password);

    this.validateActiveUser(auth);

    const token = await this.generateToken(auth);

    return {
      access_token: token,
      user: {
        id: auth.id,
        email: auth.email,
        isActive: auth.isActive,
      },
    };
  }

  private validateLoginData(email: string, password: string): void {
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email é obrigatório');
    }

    if (!password || password.trim() === '') {
      throw new BadRequestException('Senha é obrigatória');
    }

    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Email inválido');
    }
  }

  private async findAuthByEmail(email: string): Promise<Auth> {
    const auth = await this.authRepository.findByEmail(email);
    if (!auth) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return auth;
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  private validateActiveUser(auth: Auth): void {
    if (!auth.isActive) {
      throw new UnauthorizedException('Conta desativada');
    }
  }

  private async generateToken(auth: Auth): Promise<string> {
    const payload = {
      sub: auth.id,
      email: auth.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
