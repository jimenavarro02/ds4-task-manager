INSERT INTO usuarios (correo, password) VALUES ('jimena.navarro', '$2a$10$DCzSJP21Mt6AL.fSLDkDO.kdpA5VDyvIWL3CfbX20cgNhi0YNh9BK'); /*11111*/
INSERT INTO usuarios (correo, password) VALUES ('debora.zavala', '$2a$10$WVl5hZbtXhpN6mO3m2fDIOEfINXOJLpEx8AxErNJq/bVjyE/XajRa'); /*22222*/
INSERT INTO usuarios (correo, password) VALUES ('daniela.tames', '$2a$10$RKsjHQ3hjAgsQMcDAk6ZhOLprF8mjc.8l78oxsu2RrReJbjDN/SE.'); /*33333*/
INSERT INTO usuarios (correo, password) VALUES ('dario.mora', '$2a$10$iiFH544TRIFbL3ohkI7UCeaUJEXPQQkcCKWacoblcfgNdnNB4t42u'); /*44444*/

INSERT INTO tareas (titulo, descripcion, estado) 
VALUES ('Configurar repositorio en GitHub', 'Crear el repositorio y subir la estructura inicial del proyecto.', 'Completada');

INSERT INTO tareas (titulo, descripcion, estado) 
VALUES ('Implementar pipeline de CI/CD', 'Configurar GitHub Actions para la compilación y pruebas automáticas.', 'En progreso');

INSERT INTO tareas (titulo, descripcion, estado) 
VALUES ('Diseñar pruebas con Selenium', 'Automatizar el flujo de inicio de sesión y creación de tareas en el navegador.', 'Pendiente');