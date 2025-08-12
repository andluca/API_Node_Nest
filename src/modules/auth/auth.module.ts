import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auth } from './entities/auth.entity';
import { AuthRepository } from './repository/auth.repository';
import { AuthLoginService } from './service/auth-login.service';
import { AuthSeedService } from './service/auth-seed.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
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
  controllers: [],
  providers: [
    AuthRepository,
    AuthLoginService,
    AuthSeedService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthLoginService, JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly authSeedService: AuthSeedService) {}

  async onModuleInit() {
    await this.authSeedService.createDefaultAdmin();
  }
}
