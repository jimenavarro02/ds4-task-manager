package com.tareas.controller;

import com.tareas.model.Tarea;
import com.tareas.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaService tareaService;

    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaService.listarTodas();
    }

    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea tarea) {
        return tareaService.guardar(tarea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody Tarea detallesTarea) {
        return tareaService.buscarPorId(id)
                .map(tarea -> {
                    tarea.setTitulo(detallesTarea.getTitulo());
                    tarea.setDescripcion(detallesTarea.getDescripcion());
                    tarea.setEstado(detallesTarea.getEstado());
                    return ResponseEntity.ok(tareaService.guardar(tarea));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        if (tareaService.buscarPorId(id).isPresent()) {
            tareaService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}