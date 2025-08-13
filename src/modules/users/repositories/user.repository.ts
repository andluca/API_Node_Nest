import { Injectable } from '@nestjs/common';
import {
  DatabaseUserRow,
  IUserRepository,
} from '../interfaces/user-repository.interface';
import { H2DatabaseService } from '../../../config/database.config';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly h2Database: H2DatabaseService) {}

  mapRowToUser(row: DatabaseUserRow): User {
    return {
      id: row.id,
      name: row.name,
      gender: row.gender,
      email: row.email,
      birthDate: row.birth_date,
      placeOfBirth: row.place_of_birth,
      nationality: row.nationality,
      cpf: row.cpf,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.h2Database.query(
      `
      INSERT INTO users (id, name, gender, email, birth_date, place_of_birth, nationality, cpf)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        uuidv4(),
        userData.name,
        userData.gender,
        userData.email,
        userData.birthDate,
        userData.placeOfBirth,
        userData.nationality,
        userData.cpf,
      ],
    );

    const dbRow = (await user).rows[0] as DatabaseUserRow;
    return this.mapRowToUser(dbRow);
  }

  async findAll(): Promise<User[]> {
    const users = await this.h2Database.query('SELECT * FROM users');
    return users.rows.map((row) => this.mapRowToUser(row as DatabaseUserRow));
  }

  async findById(id: string): Promise<User | null> {
    const user = this.h2Database.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);

    const dbRow = (await user).rows[0] as DatabaseUserRow;
    return this.mapRowToUser(dbRow);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.h2Database.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    const dbRow = (await user).rows[0] as DatabaseUserRow;
    return dbRow ? this.mapRowToUser(dbRow) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const query = `
      UPDATE users
      SET
        name = $1,
        gender = $2,
        email = $3,
        birth_date = $4,
        place_of_birth = $5,
        nationality = $6,
        cpf = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      userData.name,
      userData.gender,
      userData.email,
      userData.birthDate,
      userData.placeOfBirth,
      userData.nationality,
      userData.cpf,
      id,
    ];

    const result = this.h2Database.query(query, values);
    const dbRow = (await result).rows[0] as DatabaseUserRow;
    return dbRow ? this.mapRowToUser(dbRow) : null;
  }

  async delete(id: string): Promise<void> {
    await this.h2Database.query('DELETE FROM users WHERE id = $1', [id]);
  }

  async cpfExists(cpf: string): Promise<boolean> {
    const result = await this.h2Database.query(
      'SELECT * FROM users WHERE cpf = $1',
      [cpf],
    );
    return !!(result.rowCount && result.rowCount > 0);
  }

  async emailExists(email: string): Promise<boolean> {
    const result = await this.h2Database.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return !!(result.rowCount && result.rowCount > 0);
  }
}
