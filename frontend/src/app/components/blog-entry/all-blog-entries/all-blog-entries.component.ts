import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';
import { BlogService } from 'src/app/services/blog/blog.service';

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss'],
})
export class AllBlogEntriesComponent {
  @Input() blogEntries: BlogEntriesPageable | null = null;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageEvent: PageEvent = new PageEvent();

  constructor(private router: Router) {}

  onPaginateChange(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;
    this.paginate.emit(event);
  }

  navigate(id: number) {
    this.router.navigateByUrl(`blog-entry/${id}`);
  }
}
