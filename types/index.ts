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
  make: string;
  model: string;
  year: number;
  color: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
