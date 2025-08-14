import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Partial<User>): Promise<User> {
    this.validateRequiredFields(userData);

    this.validateFormats(userData);

    await this.validateUniqueness(userData);

    return await this.userRepository.create(userData);
  }

  private validateRequiredFields(userData: Partial<User>): void {
    if (!userData.name) {
      throw new BadRequestException('Nome é obrigatório');
    }

    if (!userData.cpf) {
      throw new BadRequestException('CPF é obrigatório');
    }

    if (!userData.birthDate) {
      throw new BadRequestException('Data de nascimento é obrigatória');
    }
  }

  private validateFormats(userData: Partial<User>): void {
    if (!this.isValidCpf(userData.cpf!)) {
      throw new BadRequestException('CPF inválido');
    }

    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new BadRequestException('Email inválido');
    }

    if (!this.isValidBirthDate(userData.birthDate!)) {
      throw new BadRequestException('Data de nascimento inválida');
    }

    if (userData.gender && !this.isValidGender(userData.gender)) {
      throw new BadRequestException('Gênero deve ser M ou F');
    }
  }

  private async validateUniqueness(userData: Partial<User>): Promise<void> {
    if (await this.userRepository.cpfExists(userData.cpf!)) {
      throw new ConflictException('CPF já está cadastrado');
    }

    if (
      userData.email &&
      (await this.userRepository.emailExists(userData.email))
    ) {
      throw new ConflictException('Email já está cadastrado');
    }
  }

  public isValidCpf(cpf: string): boolean {
    if (!cpf) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cpf.charAt(9)) !== digit1) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    return parseInt(cpf.charAt(10)) === digit2;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidBirthDate(birthDate: Date): boolean {
    const today = new Date();
    const birth = new Date(birthDate);

    if (birth > today) return false;

    const age = today.getFullYear() - birth.getFullYear();
    return age >= 0 && age <= 150;
  }

  private isValidGender(gender: string): boolean {
    return ['M', 'F'].includes(gender.toUpperCase());
  }
}
