export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
}

export interface createUserDTO extends Omit<User, 'id'> {}
