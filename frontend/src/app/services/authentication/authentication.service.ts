import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

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
  profileImage?: string;
}

export const JWT_NAME = 'blog-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  getUserToken(): string | null {
    return localStorage.getItem(JWT_NAME);
  }

  login(loginForm: LoginForm): Observable<string> {
    return this.http
      .post<any>('/api/users/login', {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          localStorage.setItem(JWT_NAME, token.access_token);
          return token;
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<any>('/api/users/', user).pipe(map((user) => user));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    if (token) return !this.jwtHelper.isTokenExpired(token);
    return false;
  }
}
