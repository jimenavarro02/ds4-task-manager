package com.tareas.controller;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tareas.model.Tarea;
import com.tareas.service.TareaService;

@ExtendWith(MockitoExtension.class)
public class TareaControllerTest {

    @Mock
    private TareaService tareaService;

    @InjectMocks
    private TareaController tareaController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(tareaController).build();
    }

    @Test
    void obtenerTareasDevuelveLaLista() throws Exception {
        Tarea t1 = new Tarea("Tarea 1", "Desc 1", "Pendiente");
        Tarea t2 = new Tarea("Tarea 2", "Desc 2", "Completada");
        when(tareaService.listarTodas()).thenReturn(Arrays.asList(t1, t2));

        mockMvc.perform(get("/api/tareas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].titulo").value("Tarea 1"))
                .andExpect(jsonPath("$[1].estado").value("Completada"));
    }

    @Test
    void crearTareaDevuelveLaTareaGuardada() throws Exception {
        Tarea nueva = new Tarea("Nueva", "Descripción", "Pendiente");
        when(tareaService.guardar(any(Tarea.class))).thenReturn(nueva);

        mockMvc.perform(post("/api/tareas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nueva)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Nueva"))
                .andExpect(jsonPath("$.estado").value("Pendiente"));
    }

    @Test
    void actualizarTareaExistenteModificaSusCampos() throws Exception {
        Tarea existente = new Tarea("Vieja", "Desc vieja", "Pendiente");
        Tarea cambios = new Tarea("Actualizada", "Desc nueva", "Completada");
        when(tareaService.buscarPorId(1L)).thenReturn(Optional.of(existente));
        when(tareaService.guardar(any(Tarea.class))).thenReturn(existente);

        mockMvc.perform(put("/api/tareas/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cambios)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Actualizada"));

        assertEquals("Actualizada", existente.getTitulo());
        assertEquals("Desc nueva", existente.getDescripcion());
        assertEquals("Completada", existente.getEstado());
    }

    @Test
    void actualizarTareaInexistenteDevuelve404() throws Exception {
        when(tareaService.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/tareas/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new Tarea("X", "Y", "Pendiente"))))
                .andExpect(status().isNotFound());

        verify(tareaService, never()).guardar(any(Tarea.class));
    }

    @Test
    void eliminarTareaExistenteDevuelve200() throws Exception {
        when(tareaService.buscarPorId(1L)).thenReturn(Optional.of(new Tarea("T", "D", "Pendiente")));

        mockMvc.perform(delete("/api/tareas/1"))
                .andExpect(status().isOk());

        verify(tareaService).eliminar(1L);
    }

    @Test
    void eliminarTareaInexistenteDevuelve404() throws Exception {
        when(tareaService.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/tareas/99"))
                .andExpect(status().isNotFound());

        verify(tareaService, never()).eliminar(anyLong());
    }
}
