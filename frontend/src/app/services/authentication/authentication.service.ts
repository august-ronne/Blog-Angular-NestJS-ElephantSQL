import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
  passwordConfirm?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  login(loginForm: LoginForm): Observable<string> {
    return this.http
      .post<any>('/api/users/login', {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          localStorage.setItem('blog-token', token.access_token);
          return token;
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<any>('/api/users/', user).pipe(map((user) => user));
  }
}
