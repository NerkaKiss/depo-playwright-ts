import { User } from '../types/user';

export const validUser: User = {
  email: process.env.USER_EMAIL ?? '',
  password: process.env.USER_PASSWORD ?? '',
};
