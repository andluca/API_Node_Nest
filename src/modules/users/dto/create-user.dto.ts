import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo',
    minLength: 2,
    maxLength: 255,
    example: 'Lucas Galindo',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(2, 255, { message: 'Nome deve ter entre 2 e 255 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Gênero (M ou F)',
    maxLength: 1,
    enum: ['M', 'F'],
    example: 'M',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  @Length(1, 1, { message: 'Gênero deve ter 1 caractere' })
  @Matches(/^[MF]$/i, { message: 'Gênero deve ser M ou F' })
  gender?: string;

  @ApiPropertyOptional({
    description: 'E-mail do usuário',
    minLength: 5,
    maxLength: 255,
    format: 'email',
    example: 'email@email.com',
    nullable: true,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  @Length(5, 255, { message: 'Email deve ter entre 5 e 255 caracteres' })
  email?: string;

  @ApiProperty({
    description: 'Data de nascimento (YYYY-MM-DD)',
    type: String,
    format: 'date',
    example: '2004-11-30',
  })
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate: string;

  @ApiPropertyOptional({
    description: 'Local de nascimento',
    minLength: 2,
    maxLength: 255,
    example: 'São José do Rio Preto',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Local de nascimento deve ser uma string' })
  @Length(2, 255, {
    message: 'Local de nascimento deve ter entre 2 e 255 caracteres',
  })
  placeOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Nacionalidade',
    minLength: 2,
    maxLength: 255,
    example: 'Brasileiro',
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'Nacionalidade deve ser uma string' })
  @Length(2, 255, {
    message: 'Nacionalidade deve ter entre 2 e 255 caracteres',
  })
  nationality?: string;

  @ApiProperty({
    description: 'CPF (somente números)',
    pattern: '^\\d{11}$',
    minLength: 11,
    maxLength: 11,
    example: '47047368817',
  })
  @IsString({ message: 'CPF deve ser uma string' })
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 caracteres' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  cpf: string;
}
