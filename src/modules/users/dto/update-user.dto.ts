import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @Length(2, 255, { message: 'Nome deve ter entre 2 e 255 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  @Length(1, 1, { message: 'Gênero deve ter 1 caractere' })
  @Matches(/^[MF]$/i, { message: 'Gênero deve ser M ou F' })
  gender?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email deve ser válido' })
  @Length(5, 255, { message: 'Email deve ter entre 5 e 255 caracteres' })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'Local de nascimento deve ser uma string' })
  @Length(2, 255, {
    message: 'Local de nascimento deve ter entre 2 e 255 caracteres',
  })
  placeOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'Nacionalidade deve ser uma string' })
  @Length(2, 255, {
    message: 'Nacionalidade deve ter entre 2 e 255 caracteres',
  })
  nationality?: string;

  cpf?: never;
}
