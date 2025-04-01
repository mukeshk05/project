export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  provider?: 'local' | 'google' | 'facebook' | 'github';
}

export interface Booking {
  _id?: string;
  userId: string;
  destinationId: string;
  checkIn: Date;
  checkOut: Date;
  travelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}