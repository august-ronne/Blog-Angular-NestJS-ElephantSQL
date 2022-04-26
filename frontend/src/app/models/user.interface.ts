export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  roles?: string[];
  password?: string;
  passwordConfirm?: string;
  profileImage?: string;
}
