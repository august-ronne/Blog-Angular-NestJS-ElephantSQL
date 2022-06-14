import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { BlogEntry } from 'src/app/models/blog-entry.interface';
import { BlogService } from 'src/app/services/blog/blog.service';
import { WINDOW } from 'src/app/window-token';

@Component({
  selector: 'app-view-blog-entry',
  templateUrl: './view-blog-entry.component.html',
  styleUrls: ['./view-blog-entry.component.scss'],
})
export class ViewBlogEntryComponent {
  origin = this.window.location.origin;

  blogEntry$: Observable<BlogEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const blogEntryId: number = parseInt(params['id']);
      return this.blogService
        .findOneBlogEntry(blogEntryId)
        .pipe(map((blogEntry: BlogEntry) => blogEntry));
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    @Inject(WINDOW) private window: Window
  ) {}
}
