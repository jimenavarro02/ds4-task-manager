package com.tareas.controller;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

public class AuthControllerTest {

    private final MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new AuthController()).build();

    @Test
    void meDevuelveElCorreoDelUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/api/auth/me").principal(() -> "dario.mora"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("dario.mora"));
    }
}