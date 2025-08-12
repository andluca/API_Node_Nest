import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { IAuthRepository } from '../interface/auth-repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async create(authData: Partial<Auth>): Promise<Auth> {
    const auth = this.authRepository.create(authData);
    return await this.authRepository.save(auth);
  }

  async findById(id: string): Promise<Auth | null> {
    return await this.authRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: string, authData: Partial<Auth>): Promise<Auth | null> {
    await this.authRepository.update(id, authData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.authRepository.delete(id);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    return await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.authRepository.count({
      where: { email },
    });
    return count > 0;
  }

  async findByUserId(userId: string): Promise<Auth | null> {
    return await this.authRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async changePassword(
    id: string,
    hashedPassword: string,
  ): Promise<Auth | null> {
    return await this.update(id, { password: hashedPassword });
  }

  async userIsActive(id: string): Promise<boolean> {
    const auth = await this.authRepository.findOne({
      where: { id },
      select: ['isActive'],
    });
    return auth?.isActive || false;
  }
}
