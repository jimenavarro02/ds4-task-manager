import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { API_URL } from '../../config';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('valida campos vacíos', () => {
    const c = TestBed.createComponent(LoginComponent).componentInstance;
    c.entrar();
    expect(c.error()).toBe('Ingresa usuario y contraseña');
  });

  it('login correcto navega a /tareas', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const c = TestBed.createComponent(LoginComponent).componentInstance;
    c.usuario = 'dario.mora';
    c.password = '44444';
    c.entrar();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_URL}/api/auth/me`)
      .flush({ correo: 'dario.mora' });
    expect(navigate).toHaveBeenCalledWith(['/tareas']);
  });

  it('credenciales incorrectas muestran error', () => {
    const c = TestBed.createComponent(LoginComponent).componentInstance;
    c.usuario = 'x';
    c.password = 'y';
    c.entrar();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_URL}/api/auth/me`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(c.error()).toBe('Usuario o contraseña incorrectos');
    expect(c.cargando()).toBe(false);
  });
});
