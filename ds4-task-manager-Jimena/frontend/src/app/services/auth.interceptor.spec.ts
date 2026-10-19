import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { API_URL } from '../config';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => ctrl.verify());

  it('agrega Authorization a las llamadas al API cuando hay sesión', () => {
    auth.login('a', 'b').subscribe();
    ctrl.expectOne(`${API_URL}/api/auth/me`).flush({ correo: 'a' });

    http.get(`${API_URL}/api/tareas`).subscribe();
    const req = ctrl.expectOne(`${API_URL}/api/tareas`);
    expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('a:b'));
    req.flush([]);
  });

  it('no agrega Authorization sin sesión', () => {
    http.get(`${API_URL}/api/tareas`).subscribe();
    const req = ctrl.expectOne(`${API_URL}/api/tareas`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('ante un 401 cierra sesión y redirige a /login', () => {
    auth.login('a', 'b').subscribe();
    ctrl.expectOne(`${API_URL}/api/auth/me`).flush({ correo: 'a' });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    http.get(`${API_URL}/api/tareas`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_URL}/api/tareas`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(auth.autenticado()).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
