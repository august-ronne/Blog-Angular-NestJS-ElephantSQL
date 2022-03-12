import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, pipe, tap } from 'rxjs';
import { UserData, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  dataSource: UserData = {};
  pageEvent: PageEvent = new PageEvent();
  columnsToDisplay: string[] = ['id', 'name', 'username', 'email', 'role'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource(): void {
    this.userService
      .findAll(1, 5)
      .pipe(map((userData: UserData) => (this.dataSource = userData)))
      .subscribe();
  }

  onPaginateChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const size = event.pageSize;
    this.userService
      .findAll(page, size)
      .pipe(map((userData: UserData) => (this.dataSource = userData)))
      .subscribe();
  }
}
