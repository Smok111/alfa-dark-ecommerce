
export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  images: { imageUrl: string }[];
  category: { id: string, name: string };
}
