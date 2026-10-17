import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login';
import { TareasComponent } from './pages/tareas/tareas';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tareas', component: TareasComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'tareas' },
  { path: '**', redirectTo: 'tareas' },
];
