import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './repository/auth.repository';
import { AuthLoginService } from './service/auth-login.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthLoginController } from './controllers/auth-login.controller';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'default-secret-key'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '24h') },
      }),
    }),
  ],
  controllers: [AuthLoginController],
  providers: [AuthRepository, AuthLoginService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, PassportModule, JwtAuthGuard, AuthLoginService],
})
export class AuthModule {}
