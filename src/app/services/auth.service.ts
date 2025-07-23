import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse } from '@utils/api';
import { AuthResponse } from '@models/auth.model';
import { environment } from '@environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey: string = 'token';
  private refreshTokenKey: string = 'refresh_token';
  url: any = `${environment.apiUrl}/users/login`;
  errorSubject = new BehaviorSubject<any>(null);
  errorMessage: any = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!window.localStorage.getItem(this.tokenKey);
  }

  login(username: string, password: string) {
    this.http
      .post<ApiResponse<AuthResponse>>(
        this.url,
        {
          username,
          password,
        },
        httpOptions
      )
      .pipe(
        tap((res) => {
          if(res.success){
            this.saveToken(res.data.accessToken);
            this.saveRefreshToken(res.data.refreshToken);
            this.router.navigate(['/']);
          }else{
            this.errorSubject.next(res.message);
          }
        }),
        catchError((error) => {
          console.error('Login error', error);
          this.errorSubject.next(error.message);
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  logout(): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(this.tokenKey);
    }
  }

  // ✅ Lưu access token
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // ✅ Lưu refresh token
  saveRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return window.localStorage.getItem(this.tokenKey);
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return this.http
      .post<{ accessToken: string }>('https://your-api.com/api/auth/refresh', {
        refreshToken,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.accessToken);
        }),
        map((res) => res.accessToken)
      );
  }
}
