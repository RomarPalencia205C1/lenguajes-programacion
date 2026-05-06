export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  edad: number;
  pais: string;
  sexo: string;
  is_active: boolean;
}

export interface UserCreate extends Omit<User, 'id' | 'is_active'> {
  password?: string;
  is_active?: boolean;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}
