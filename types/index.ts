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
  name: string; // <-- backend expects 'make', not 'name'
  model: string;
  year: number;
  categoryId: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
