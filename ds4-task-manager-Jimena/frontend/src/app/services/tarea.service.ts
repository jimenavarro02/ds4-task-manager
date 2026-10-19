import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Tarea } from '../models/tarea';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/api/tareas`;

  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.url);
  }

  crear(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.url, tarea);
  }

  actualizar(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.url}/${id}`, tarea);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
