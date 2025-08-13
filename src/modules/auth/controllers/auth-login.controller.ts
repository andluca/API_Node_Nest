import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthLoginService, LoginResponse } from '../service/auth-login.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { IsPublic } from 'src/shared/decorators';

@Controller('auth')
export class AuthLoginController {
  constructor(private readonly authLoginService: AuthLoginService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthLoginDto): Promise<LoginResponse> {
    return await this.authLoginService.execute(
      loginDto.email,
      loginDto.password,
    );
  }
}
