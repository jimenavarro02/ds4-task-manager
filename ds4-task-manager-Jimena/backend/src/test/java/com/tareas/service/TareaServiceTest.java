package com.tareas.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tareas.model.Tarea;
import com.tareas.repository.TareaRepository;

@ExtendWith(MockitoExtension.class)
public class TareaServiceTest {

    @Mock
    private TareaRepository tareaRepository;

    @InjectMocks
    private TareaService tareaService;

    @Test
    public void testListarTodas() {
        Tarea tarea1 = new Tarea("Estudiar CI/CD", "Revisar la investigación de Software IV", "Pendiente");
        Tarea tarea2 = new Tarea("Configurar GitHub Actions", "Subir el pipeline al repositorio", "En progreso");

        when(tareaRepository.findAll()).thenReturn(Arrays.asList(tarea1, tarea2));

        List<Tarea> resultado = tareaService.listarTodas();

        assertEquals(2, resultado.size());
        verify(tareaRepository, times(1)).findAll();
    }

    @Test
    public void testBuscarPorIdExistente() {
        Tarea tarea = new Tarea("Estudiar CI/CD", "Revisar la investigación", "Pendiente");
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tarea));

        Optional<Tarea> resultado = tareaService.buscarPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Estudiar CI/CD", resultado.get().getTitulo());
    }

    @Test
    public void testBuscarPorIdInexistente() {
        when(tareaRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Tarea> resultado = tareaService.buscarPorId(99L);

        assertTrue(resultado.isEmpty());
    }

    @Test
    public void testGuardar() {
        Tarea tarea = new Tarea("Nueva tarea", "Descripción", "Pendiente");
        when(tareaRepository.save(tarea)).thenReturn(tarea);

        Tarea resultado = tareaService.guardar(tarea);

        assertSame(tarea, resultado);
        verify(tareaRepository, times(1)).save(tarea);
    }

    @Test
    public void testEliminar() {
        tareaService.eliminar(1L);

        verify(tareaRepository, times(1)).deleteById(1L);
    }
}