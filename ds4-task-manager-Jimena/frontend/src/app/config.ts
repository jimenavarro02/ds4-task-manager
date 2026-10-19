import { isDevMode } from '@angular/core';

// En desarrollo (ng serve) el backend corre en el puerto 8080.
// En producción (Docker/Render) frontend y backend comparten origen.
export const API_URL = isDevMode() ? 'http://localhost:8080' : '';
