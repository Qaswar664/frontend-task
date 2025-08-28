export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Car {
  id: string;
  name: string;
  model: string;
  year: number;
  categoryId: string;
  
}

export interface AuthState {
  token: string | null;
  user: User | null;
}