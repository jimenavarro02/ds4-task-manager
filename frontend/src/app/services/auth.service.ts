import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';

const STORAGE_KEY = 'tareas.auth';

/**
 * El backend usa HTTP Basic (sin sesión). Guardamos el header
 * "Authorization: Basic ..." en sessionStorage: se borra al cerrar la pestaña.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _usuario = signal<string | null>(sessionStorage.getItem(STORAGE_KEY + '.user'));
  private _authHeader: string | null = sessionStorage.getItem(STORAGE_KEY);

  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);

  get authHeader(): string | null {
    return this._authHeader;
  }

  login(usuario: string, password: string): Observable<{ correo: string }> {
    const header = 'Basic ' + btoa(unescape(encodeURIComponent(`${usuario}:${password}`)));
    return this.http
      .get<{ correo: string }>(`${API_URL}/api/auth/me`, {
        headers: new HttpHeaders({ Authorization: header }),
      })
      .pipe(
        tap((res) => {
          this._authHeader = header;
          this._usuario.set(res.correo);
          sessionStorage.setItem(STORAGE_KEY, header);
          sessionStorage.setItem(STORAGE_KEY + '.user', res.correo);
        }),
      );
  }

  logout(): void {
    this._authHeader = null;
    this._usuario.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY + '.user');
  }
}
