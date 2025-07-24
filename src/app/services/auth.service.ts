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
  Subject,
} from 'rxjs';
import { Router } from '@angular/router';
import { ApiResponse } from '@utils/api';
import { AuthResponse } from '@models/auth.model';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
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
  private tokenKey: string = 'token';
  private refreshTokenKey: string = 'refresh_token';
  url: any = `${environment.apiUrl}/users`;
  errorSubject = new BehaviorSubject<any>(null);
  errorMessage: any = this.errorSubject.asObservable();

  // Thêm subject để notify khi login thành công
  private loginSuccessSubject = new Subject<void>();
  public loginSuccess$ = this.loginSuccessSubject.asObservable();

  // Thêm user state management
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService // Inject UserService
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getLocalStorage(): Storage | null {
    return this.isBrowser() ? window.localStorage : null;
  }

  isLoggedIn(): boolean {
    const storage = this.getLocalStorage();
    if (!storage) return false;
    return !!storage.getItem(this.tokenKey);
  }

  login(username: string, password: string) {
    this.http
      .post<ApiResponse<AuthResponse>>(
        `${this.url}/login`,
        {
          username,
          password,
        },
        httpOptions
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            this.saveToken(res.data.accessToken);
            this.saveRefreshToken(res.data.refreshToken);
            // Lấy user profile ngay sau khi login
            this.loadUserProfile();
            // Emit event khi login thành công
            this.loginSuccessSubject.next();
            this.router.navigate(['/']);
          } else {
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

  private loadUserProfile() {
    this.userService.getProfile().subscribe((res) => {
      if (res.success) {
        this.currentUserSubject.next(res.data);
      }
    });
  }

  logout(): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.removeItem(this.tokenKey);
    }
    // Clear user data khi logout
    this.currentUserSubject.next(null);
  }

  // ✅ Lưu access token
  saveToken(token: string): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem(this.tokenKey, token);
    }
  }

  // ✅ Lưu refresh token
  saveRefreshToken(token: string): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem(this.refreshTokenKey, token);
    }
  }

  getToken(): string | null {
    const storage = this.getLocalStorage();
    if (!storage) return null;
    return storage.getItem(this.tokenKey);
  }

  refreshToken(): Observable<string> {
    const storage = this.getLocalStorage();
    const refreshToken = storage ? storage.getItem(this.refreshTokenKey) : null;
    return this.http
      .post<{ accessToken: string }>(`${this.url}/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((res) => {
          const storage = this.getLocalStorage();
          if (storage) {
            storage.setItem('token', res.accessToken);
          }
          // Lấy lại user profile khi refresh token thành công
          this.loadUserProfile();
        }),
        map((res) => res.accessToken)
      );
  }
}
