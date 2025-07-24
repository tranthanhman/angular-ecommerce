import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  throwError,
} from 'rxjs';
import { ApiResponse } from '@utils/api';
import { AuthResponse } from '@models/auth.model';
import { environment } from 'src/environments/environment';
import { User } from '@models/user.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'token';
  private readonly refreshTokenKey = 'refresh_token';
  private readonly API = `${environment.apiUrl}/users`;

  token = signal<string | null>(null);
  user = signal<User | null>(null);

  errorSubject = new BehaviorSubject<any>(null);
  errorMessage = this.errorSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem(this.tokenKey);
      if (savedToken) {
        this.token.set(savedToken);

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            this.user.set(JSON.parse(savedUser));
          } catch (e) {
            console.warn('Invalid user data in localStorage');
          }
        }
      }
    }
  }

  // Đăng nhập
  login(username: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API}/login`,
      { username, password },
      httpOptions
    );
  }

  // Thiết lập user và lưu localStorage
  setUser(token: string, user: User): void {
    this.token.set(token);
    this.user.set(user);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Đăng ký
  register(formData: any): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API}/register`,
      formData,
      httpOptions
    );
  }

  // Đăng xuất
  logout(): Observable<ApiResponse<any>> {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('user');
      localStorage.removeItem(this.refreshTokenKey);
    }

    this.token.set(null);
    this.user.set(null);

    return this.http.post<ApiResponse<any>>(
      `${this.API}/logout`,
      {},
      httpOptions
    );
  }

  // Getter user hiện tại
  get currentUser(): User | null {
    return this.user();
  }

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    return !!this.token();
  }

  // Làm mới token
  refreshToken(): Observable<{ accessToken: string }> {
    let refreshToken: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      refreshToken = localStorage.getItem(this.refreshTokenKey);
    }

    return this.http.post<{ accessToken: string }>(
      `${this.API}/refresh-token`,
      { refreshToken }
    );
  }
}
