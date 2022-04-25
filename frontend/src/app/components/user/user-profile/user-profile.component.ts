import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userId: number = -1;
  user: User = {};
  private sub: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.userId = parseInt(params['id']);
      this.userService
        .findOne(this.userId)
        .pipe(
          map((user: User) => {
            console.log(user);
            this.user = user;
          })
        )
        .subscribe();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
