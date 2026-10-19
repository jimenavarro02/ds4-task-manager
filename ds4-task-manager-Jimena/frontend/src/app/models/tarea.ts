export type EstadoTarea = 'Pendiente' | 'En progreso' | 'Completada';

export const ESTADOS: EstadoTarea[] = ['Pendiente', 'En progreso', 'Completada'];

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea | string;
}
