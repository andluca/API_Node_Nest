import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class H2DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    await this.connect();
    await this.createTables();
    await this.seedData();
    console.log('H2DatabaseService inicializado');
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    this.client = new Client({
      host: 'localhost',
      port: 5435,
      user: 'sa',
      password: '',
      database: 'testdb',
    });

    try {
      await this.client.connect();
      console.log('Conectado ao H2 Database via PostgreSQL protocol!');
    } catch (error) {
      console.error('Erro ao conectar H2:', error);
      throw error;
    }
  }

  private async disconnect() {
    if (this.client) {
      await this.client.end();
      console.log('🔌 Desconectado do H2');
    }
  }

  private async createTables() {
    try {
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          gender VARCHAR(1),
          email VARCHAR(255) UNIQUE,
          birth_date DATE NOT NULL,
          place_of_birth VARCHAR(255),
          nationality VARCHAR(255),
          cpf VARCHAR(11) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await this.client.query(`
        CREATE TABLE IF NOT EXISTS auth (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Tabelas users e auth criadas no H2!');
    } catch (error) {
      console.error('Erro ao criar tabelas:', error);
    }
  }

  private async seedData() {
    try {
      const adminExists = await this.client.query(
        'SELECT id FROM auth WHERE email = $1',
        ['admin@admin.com'],
      );
      if (adminExists.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);

        await this.client.query(
          `
          INSERT INTO auth (id, email, password, is_active) 
          VALUES ($1, $2, $3, $4)
        `,
          [uuidv4(), 'admin@admin.com', hashedPassword, true],
        );

        console.log('Usuário admin criado no H2!');
      }
    } catch (error) {
      console.error('Erro ao criar seed data:', error);
    }
  }

  async query(text: string, params: any[] = []) {
    try {
      const result = await this.client.query(text, params);
      return result;
    } catch (error) {
      console.error('Erro na query H2:', error);
      console.error('SQL:', text);
      console.error('Params:', params);
      throw error;
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.client.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
