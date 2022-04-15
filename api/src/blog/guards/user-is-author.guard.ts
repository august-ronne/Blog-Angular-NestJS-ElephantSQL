import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { BlogEntry } from '../ model/blog-entry.interface';
import { BlogService } from '../service/blog.service';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private blogService: BlogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const blogEntryId: number = Number(params.id);
    const requestJwtUser: User = request.user;
    const databaseUser: User = await this.userService.findOne(
      requestJwtUser.id,
    );
    const blogEntry: BlogEntry = await this.blogService.findOne(blogEntryId);
    return databaseUser.id === blogEntry.author.id;
  }
}
