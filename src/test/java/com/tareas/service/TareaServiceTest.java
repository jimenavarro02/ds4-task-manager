package com.tareas.service;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
        // Datos simulados (Mock)
        Tarea tarea1 = new Tarea("Estudiar CI/CD", "Revisar la investigación de Software IV", "Pendiente");
        Tarea tarea2 = new Tarea("Configurar GitHub Actions", "Subir el pipeline al repositorio", "En progreso");
        
        when(tareaRepository.findAll()).thenReturn(Arrays.asList(tarea1, tarea2));

        // Ejecución del servicio
        List<Tarea> resultado = tareaService.listarTodas();

        // Verificaciones
        assertEquals(2, resultado.size());
        verify(tareaRepository, times(1)).findAll();
    }
}