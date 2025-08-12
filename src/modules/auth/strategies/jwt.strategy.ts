import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../repository/auth.repository';

export interface JwtPayload {
  sub: string;
  email: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'default_jwt_secret',
      ),
    });
  }

  async validate(payload: JwtPayload) {
    const auth = await this.authRepository.findById(payload.sub);

    if (!auth) {
      throw new UnauthorizedException('Token inválido');
    }

    if (!auth.isActive) {
      throw new UnauthorizedException('Conta desativada');
    }

    return {
      id: auth.id,
      email: auth.email,
    };
  }
}
