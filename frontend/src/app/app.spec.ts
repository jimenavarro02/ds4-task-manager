import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { AuthService } from './services/auth.service';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el título y oculta "Cerrar sesión" sin autenticar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Task Manager');
    expect(el.querySelector('#btn-logout')).toBeNull();
  });

  it('muestra el usuario y el botón de logout al autenticar', async () => {
    sessionStorage.setItem('tareas.auth', 'Basic abc');
    sessionStorage.setItem('tareas.auth.user', 'dario.mora');
    TestBed.inject(AuthService); // lee sessionStorage
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#usuario-actual')?.textContent).toContain('dario.mora');
    expect(el.querySelector('#btn-logout')).not.toBeNull();
  });
});
