export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  credits: number;
  isAdmin?: boolean;
  status?: 'active' | 'suspended';
  createdAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'starter', name: 'Başlangıç Paketi', credits: 100, price: 50 },
  { id: 'pro', name: 'Pro Paket', credits: 500, price: 150 },
  { id: 'business', name: 'İşletme Paketi', credits: 2000, price: 400 },
];
