import { User } from '../entities/user.entity';

export interface DatabaseUserRow {
  id: string;
  name: string;
  gender?: string;
  email?: string;
  birth_date: Date;
  place_of_birth?: string;
  nationality?: string;
  cpf: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  cpfExists(cpf: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  mapRowToUser(row: DatabaseUserRow): User;
}
