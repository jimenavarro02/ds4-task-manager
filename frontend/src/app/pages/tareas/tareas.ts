import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ESTADOS, Tarea } from '../../models/tarea';
import { TareaService } from '../../services/tarea.service';

const VACIA: Tarea = { titulo: '', descripcion: '', estado: 'Pendiente' };

@Component({
  selector: 'app-tareas',
  imports: [FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class TareasComponent implements OnInit {
  private readonly service = inject(TareaService);

  readonly estados = ESTADOS;
  readonly tareas = signal<Tarea[]>([]);
  readonly error = signal<string | null>(null);

  /** Tarea en el formulario; si tiene id es edición, si no es creación. */
  form: Tarea = { ...VACIA };

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe({
      next: (t) => this.tareas.set(t),
      error: () => this.error.set('No se pudieron cargar las tareas'),
    });
  }

  get editando(): boolean {
    return this.form.id !== undefined;
  }

  editar(t: Tarea): void {
    this.form = { ...t };
  }

  cancelar(): void {
    this.form = { ...VACIA };
  }

  guardar(): void {
    if (!this.form.titulo.trim()) {
      this.error.set('El título es obligatorio');
      return;
    }
    this.error.set(null);
    const peticion =
      this.form.id !== undefined
        ? this.service.actualizar(this.form.id, this.form)
        : this.service.crear(this.form);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargar();
      },
      error: () => this.error.set('No se pudo guardar la tarea'),
    });
  }

  eliminar(t: Tarea): void {
    if (t.id === undefined) return;
    this.service.eliminar(t.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No se pudo eliminar la tarea'),
    });
  }
}
