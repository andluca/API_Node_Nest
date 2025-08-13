import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, userData: Partial<User>): Promise<User> {
    const existingUser = await this.validateUserExists(id);

    this.validateUpdateData(userData);

    this.validateFormats(userData);

    await this.validateUniqueness(id, userData);

    const finalData = {
      ...existingUser,
      ...userData,
    };

    const updatedUser = await this.userRepository.update(id, finalData);
    if (!updatedUser) {
      throw new NotFoundException('Erro ao atualizar usuário');
    }

    return updatedUser;
  }

  private async validateUserExists(id: string): Promise<User> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('ID do usuário é obrigatório');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  private validateUpdateData(userData: Partial<User>): void {
    if (userData.id) {
      throw new BadRequestException('ID não pode ser alterado');
    }

    if (userData.cpf) {
      throw new BadRequestException('CPF não pode ser alterado');
    }

    const allowedFields = [
      'name',
      'email',
      'gender',
      'birthDate',
      'placeOfBirth',
      'nationality',
    ];
    const hasValidField = allowedFields.some(
      (field) => userData[field] !== undefined,
    );

    if (!hasValidField) {
      throw new BadRequestException(
        'Pelo menos um campo deve ser fornecido para atualização',
      );
    }
  }

  private validateFormats(userData: Partial<User>): void {
    if (userData.email && !this.isValidEmail(userData.email)) {
      throw new BadRequestException('Email inválido');
    }

    if (userData.birthDate && !this.isValidBirthDate(userData.birthDate)) {
      throw new BadRequestException('Data de nascimento inválida');
    }

    if (userData.gender && !this.isValidGender(userData.gender)) {
      throw new BadRequestException('Gênero deve ser M ou F');
    }
  }

  private async validateUniqueness(
    id: string,
    userData: Partial<User>,
  ): Promise<void> {
    if (userData.email) {
      const existingUser = await this.userRepository.findByEmail(
        userData.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }
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
