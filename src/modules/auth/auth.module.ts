import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './repository/auth.repository';
import { AuthLoginService } from './service/auth-login.service';
import { AuthSeedService } from './service/auth-seed.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthLoginController } from './controllers/auth-login.controller';
import { H2DatabaseService } from 'src/config/database.config';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
  ],
  controllers: [AuthLoginController],
  providers: [
    H2DatabaseService,
    AuthRepository,
    AuthLoginService,
    AuthSeedService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    H2DatabaseService,
    AuthRepository,
    AuthLoginService,
    JwtModule,
    PassportModule,
    JwtAuthGuard,
  ],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authSeedService: AuthSeedService) {}

  async onModuleInit() {
    await this.authSeedService.createDefaultAdmin();
  }
}
