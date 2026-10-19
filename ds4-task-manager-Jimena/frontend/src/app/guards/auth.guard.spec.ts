import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient()] });
  });

  it('redirige a /login si no hay sesión', () => {
    const res = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(res instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(res as UrlTree)).toBe('/login');
  });

  it('permite el paso con sesión', () => {
    sessionStorage.setItem('tareas.auth', 'Basic x');
    sessionStorage.setItem('tareas.auth.user', 'u');
    const res = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(res).toBe(true);
  });
});
