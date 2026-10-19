import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  usuario = '';
  password = '';
  readonly error = signal<string | null>(null);
  readonly cargando = signal(false);

  entrar(): void {
    if (!this.usuario.trim() || !this.password) {
      this.error.set('Ingresa usuario y contraseña');
      return;
    }
    this.error.set(null);
    this.cargando.set(true);
    this.auth.login(this.usuario.trim(), this.password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/tareas']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(
          err?.status === 401
            ? 'Usuario o contraseña incorrectos'
            : 'No se pudo conectar con el servidor',
        );
      },
    });
  }
}
