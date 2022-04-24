import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { BlogService } from 'src/app/services/blog/blog.service';

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss'],
})
export class AllBlogEntriesComponent implements OnInit {
  pageEvent: PageEvent = new PageEvent();
  dataSource: Observable<BlogEntriesPageable> = this.blogService.indexAll(1, 5);

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {}

  onPaginateChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.dataSource = this.blogService.indexAll(page, limit);
  }
}
