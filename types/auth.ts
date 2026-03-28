export type AppUser = {
  id: number;
  first_name: string;
  surname: string;
  email: string;
  subscription_status: boolean;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AppUser;
};

export type MeResponse = {
  user: AppUser;
};