import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<void>;
  cpfExists(cpf: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
}
