import { UserRole } from './user-roles.enum';

export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
}
