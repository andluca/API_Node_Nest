import { Auth } from '../entities/auth.entity';

export interface DatabaseAuthRow {
  id: string;
  email: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IAuthRepository {
  create(authData: Partial<Auth>): Promise<Auth>;

  findById(id: string): Promise<Auth | null>;
  findByEmail(email: string): Promise<Auth | null>;
  emailExists(email: string): Promise<boolean>;

  userIsActive(id: string): Promise<boolean>;

  mapRowToAuth(row: DatabaseAuthRow): Auth;
}
