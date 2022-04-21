import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogEntriesPageable } from 'src/app/models/blog-entry.interface';

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
}
