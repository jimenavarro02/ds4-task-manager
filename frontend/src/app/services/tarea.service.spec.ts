import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../config';
import { TareaService } from './tarea.service';

describe('TareaService', () => {
  let service: TareaService;
  let http: HttpTestingController;
  const url = `${API_URL}/api/tareas`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TareaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listar hace GET', () => {
    service.listar().subscribe((r) => expect(r.length).toBe(1));
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, titulo: 'a', descripcion: '', estado: 'Pendiente' }]);
  });

  it('crear hace POST con el cuerpo', () => {
    const t = { titulo: 'a', descripcion: 'b', estado: 'Pendiente' };
    service.crear(t).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(t);
    req.flush({ ...t, id: 1 });
  });

  it('actualizar hace PUT a /id', () => {
    service.actualizar(5, { titulo: 'a', descripcion: '', estado: 'Completada' }).subscribe();
    const req = http.expectOne(`${url}/5`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('eliminar hace DELETE a /id', () => {
    service.eliminar(5).subscribe();
    const req = http.expectOne(`${url}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
