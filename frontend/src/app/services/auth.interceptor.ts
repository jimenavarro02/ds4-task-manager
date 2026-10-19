import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from './auth.service';

/** Agrega el header Authorization a las llamadas al API y vuelve al login si el backend responde 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const esApi = req.url.startsWith(`${API_URL}/api/`);
  const yaTieneAuth = req.headers.has('Authorization');
  const authReq =
    esApi && !yaTieneAuth && auth.authHeader
      ? req.clone({ setHeaders: { Authorization: auth.authHeader } })
      : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // 401 en el propio login lo maneja la pantalla de login (credenciales incorrectas)
      if (err instanceof HttpErrorResponse && err.status === 401 && !yaTieneAuth) {
        auth.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
