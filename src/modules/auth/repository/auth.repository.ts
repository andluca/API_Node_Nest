import { Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import {
  DatabaseAuthRow,
  IAuthRepository,
} from '../interface/auth-repository.interface';
import { H2DatabaseService } from 'src/config/database.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly h2Database: H2DatabaseService) {}

  mapRowToAuth(row: DatabaseAuthRow): Auth {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(authData: Partial<Auth>): Promise<Auth> {
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();

    const query = `
      INSERT INTO auth (id, email, password, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      id,
      authData.email,
      authData.password,
      authData.isActive,
      createdAt,
      updatedAt,
    ];

    const auth = await this.h2Database.query(query, values);

    const dbRow = auth.rows[0] as DatabaseAuthRow;
    return this.mapRowToAuth(dbRow);
  }

  async findById(id: string): Promise<Auth | null> {
    const query = 'SELECT * FROM auth WHERE id = $1';
    const result = await this.h2Database.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const dbRow = result.rows[0] as DatabaseAuthRow;
    return this.mapRowToAuth(dbRow);
  }

  async findByEmail(email: string): Promise<Auth | null> {
    const query = 'SELECT * FROM auth WHERE email = $1';
    const result = await this.h2Database.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const dbRow = result.rows[0] as DatabaseAuthRow;
    return this.mapRowToAuth(dbRow);
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.h2Database.query(
      'SELECT * FROM auth WHERE email = $1',
      [email],
    );
    return !!(result.rowCount && result.rowCount > 0);
  }

  async userIsActive(id: string): Promise<boolean> {
    const result = await this.h2Database.query(
      'SELECT is_active FROM auth WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0) {
      return false;
    }

    const dbRow = result.rows[0] as DatabaseAuthRow;
    return dbRow.is_active;
  }
}
