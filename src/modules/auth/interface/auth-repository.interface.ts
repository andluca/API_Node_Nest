import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
  create(authData: Partial<Auth>): Promise<Auth>;
  findById(id: string): Promise<Auth | null>;
  update(id: string, authData: Partial<Auth>): Promise<Auth | null>;
  delete(id: string): Promise<void>;

  findByEmail(email: string): Promise<Auth | null>;
  emailExists(email: string): Promise<boolean>;
  findByUserId(userId: string): Promise<Auth | null>;

  changePassword(id: string, hashedPassword: string): Promise<Auth | null>;
  userIsActive(id: string): Promise<boolean>;
}
