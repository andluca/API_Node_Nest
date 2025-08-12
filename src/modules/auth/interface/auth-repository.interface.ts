import { Auth } from '../entities/auth.entity';

export interface IAuthRepository {
  create(authData: Partial<Auth>): Promise<Auth>;

  findById(id: string): Promise<Auth | null>;
  findByEmail(email: string): Promise<Auth | null>;
  emailExists(email: string): Promise<boolean>;

  userIsActive(id: string): Promise<boolean>;
}
