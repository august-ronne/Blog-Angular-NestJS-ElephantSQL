import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { User } from 'src/app/models/user.interface';
import { BlogService } from 'src/app/services/blog/blog.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  private userId$: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  );

  user$: Observable<User> = this.userId$.pipe(
    switchMap((userId: number) => this.userService.findOne(userId))
  );

  blogEntries$: Observable<BlogEntriesPageable> = this.userId$.pipe(
    switchMap((userId: number) => this.blogService.indexAllByUser(userId, 1, 5))
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private blogService: BlogService
  ) {}

  onPaginateChange(event: PageEvent) {
    return this.userId$
      .pipe(
        tap((userId: number) => {
          this.blogEntries$ = this.blogService.indexAllByUser(
            userId,
            event.pageIndex,
            event.pageSize
          );
        })
      )
      .subscribe();
  }
}
