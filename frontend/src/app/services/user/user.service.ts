import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../authentication/authentication.service';

export interface UserData {
  items?: User[];
  meta?: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links?: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findOne(id: number): Observable<User> {
    const apiString: string = '/api/users/' + id;
    return this.http.get<User>(apiString).pipe(map((user: User) => user));
  }

  findAll(page: number, size: number): Observable<UserData> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(size));
    return this.http.get<UserData>('/api/users', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(this.handleError)
    );
  }

  updateOne(user: User): Observable<User> {
    const apiString: string = 'api/users/' + user.id;
    return this.http.put<User>(apiString, user);
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>(
      'api/users/upload-profile-image',
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  paginateByName(
    page: number,
    size: number,
    username: string
  ): Observable<UserData> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(size))
      .set('username', username);
    return this.http
      .get('/api/users', { params })
      .pipe(map((userData: UserData) => userData));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }
}
