import { Auth } from 'src/modules/auth/entities/auth.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 1, nullable: true })
  gender: string;

  @Column({ length: 255, nullable: true, unique: true })
  email: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ length: 255, nullable: true })
  placeOfBirth: string;

  @Column({ length: 255, nullable: true })
  nationality: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @OneToOne(() => Auth, (auth) => auth.user, { nullable: true })
  auth: Auth;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
