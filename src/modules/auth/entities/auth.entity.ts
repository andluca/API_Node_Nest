export class Auth {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<Auth>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
