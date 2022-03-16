import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { filter, map, pipe, tap } from 'rxjs';
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
  filterValue: string = '';

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
    if (this.filterValue === '') {
      this.userService
        .findAll(page, size)
        .pipe(map((userData: UserData) => (this.dataSource = userData)))
        .subscribe();
    } else {
      this.userService
        .paginateByName(page - 1, size, this.filterValue)
        .pipe(map((userData: UserData) => (this.dataSource = userData)))
        .subscribe();
    }
  }

  findByName(username: string): void {
    console.log(username);
    this.userService
      .paginateByName(0, 5, username)
      .pipe(map((userData: UserData) => (this.dataSource = userData)))
      .subscribe();
  }
}
