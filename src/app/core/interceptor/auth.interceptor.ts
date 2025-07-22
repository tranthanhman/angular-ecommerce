import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { Observable, throwError, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return auth.refreshToken().pipe(
            switchMap((newAccessToken) => {
              isRefreshing = false;
              auth.saveToken(newAccessToken); // lưu token mới
              refreshTokenSubject.next(newAccessToken);

              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` },
              });
              return next(retryReq); // ⚡ retry request cũ
            }),
            catchError((err) => {
              isRefreshing = false;
              auth.logout();
              router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next(retryReq);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
