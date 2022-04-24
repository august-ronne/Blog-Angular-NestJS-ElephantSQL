import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BlogEntriesPageable,
  BlogEntry,
} from 'src/app/models/blog-entry.interface';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  indexAll(page: number, limit: number): Observable<BlogEntriesPageable> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
    return this.http.get<BlogEntriesPageable>('/api/blog-entries', { params });
  }

  createNewBlogEntry(blogEntry: BlogEntry): Observable<BlogEntry> {
    return this.http.post<BlogEntry>('/api/blog-entries', blogEntry);
  }

  uploadBlogEntryHeaderImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>(
      '/api/blog-entries/image/upload',
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
