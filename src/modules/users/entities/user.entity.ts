export class User {
  id: string;
  name: string;
  gender?: string;
  email?: string;
  birthDate: Date;
  placeOfBirth?: string;
  nationality?: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
