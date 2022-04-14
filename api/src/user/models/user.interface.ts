import { BlogEntry } from 'src/blog/ model/blog-entry.interface';
import { UserRole } from './user-roles.enum';

export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: UserRole[];
  profileImage?: string;
  blogEntries?: BlogEntry[];
}
