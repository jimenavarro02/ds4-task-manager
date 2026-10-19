import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../../config';
import { TareasComponent } from './tareas';

const url = `${API_URL}/api/tareas`;
const datos = [
  { id: 1, titulo: 'Uno', descripcion: 'd1', estado: 'Pendiente' },
  { id: 2, titulo: 'Dos', descripcion: 'd2', estado: 'Completada' },
];

describe('TareasComponent', () => {
  let ctrl: HttpTestingController;

  async function crear() {
    const fixture = TestBed.createComponent(TareasComponent);
    fixture.detectChanges();
    ctrl.expectOne(url).flush(datos);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('lista las tareas del backend', async () => {
    const fixture = await crear();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li.tarea');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Uno');
  });

  it('no guarda si el título está vacío', async () => {
    const fixture = await crear();
    fixture.componentInstance.guardar();
    expect(fixture.componentInstance.error()).toBe('El título es obligatorio');
  });

  it('crea una tarea y recarga la lista', async () => {
    const fixture = await crear();
    const c = fixture.componentInstance;
    c.form = { titulo: 'Nueva', descripcion: 'x', estado: 'Pendiente' };
    c.guardar();
    const post = ctrl.expectOne(url);
    expect(post.request.method).toBe('POST');
    post.flush({ ...c.form, id: 3 });
    ctrl.expectOne(url).flush(datos);
    expect(c.form.titulo).toBe('');
  });

  it('edita una tarea con PUT', async () => {
    const fixture = await crear();
    const c = fixture.componentInstance;
    c.editar(datos[0]);
    expect(c.editando).toBe(true);
    c.form.titulo = 'Editada';
    c.guardar();
    const put = ctrl.expectOne(`${url}/1`);
    expect(put.request.method).toBe('PUT');
    expect(put.request.body.titulo).toBe('Editada');
    put.flush({});
    ctrl.expectOne(url).flush(datos);
  });

  it('elimina una tarea con DELETE y recarga', async () => {
    const fixture = await crear();
    fixture.componentInstance.eliminar(datos[1]);
    const del = ctrl.expectOne(`${url}/2`);
    expect(del.request.method).toBe('DELETE');
    del.flush(null);
    ctrl.expectOne(url).flush([datos[0]]);
  });
});
