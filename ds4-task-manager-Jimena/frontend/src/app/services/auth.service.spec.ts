import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../config';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('login correcto guarda el header Basic y marca autenticado', () => {
    service.login('dario.mora', '44444').subscribe();
    const req = http.expectOne(`${API_URL}/api/auth/me`);
    expect(req.request.headers.get('Authorization')).toBe('Basic ' + btoa('dario.mora:44444'));
    req.flush({ correo: 'dario.mora' });

    expect(service.autenticado()).toBe(true);
    expect(service.usuario()).toBe('dario.mora');
    expect(sessionStorage.getItem('tareas.auth')).toBe('Basic ' + btoa('dario.mora:44444'));
  });

  it('login con credenciales inválidas no autentica', () => {
    let status = 0;
    service.login('x', 'y').subscribe({ error: (e) => (status = e.status) });
    http.expectOne(`${API_URL}/api/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(service.autenticado()).toBe(false);
    expect(service.authHeader).toBeNull();
  });

  it('logout limpia la sesión', () => {
    service.login('a', 'b').subscribe();
    http.expectOne(`${API_URL}/api/auth/me`).flush({ correo: 'a' });
    service.logout();

    expect(service.autenticado()).toBe(false);
    expect(sessionStorage.getItem('tareas.auth')).toBeNull();
  });
});
