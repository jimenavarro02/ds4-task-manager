package com.tareas;

import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tareas.model.Usuario;
import com.tareas.repository.UsuarioRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class SeguridadIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Test
    void sinCredencialesDevuelve401SinPopupDelNavegador() throws Exception {
        mockMvc.perform(get("/api/tareas"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().doesNotExist("WWW-Authenticate"));
    }

    @Test
    void conPasswordIncorrectaDevuelve401() throws Exception {
        mockMvc.perform(get("/api/tareas").with(httpBasic("dario.mora", "incorrecta")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void conCredencialesValidasSePuedenListarLasTareas() throws Exception {
        mockMvc.perform(get("/api/tareas").with(httpBasic("dario.mora", "444444")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void authMeDevuelveElCorreoDelUsuario() throws Exception {
        mockMvc.perform(get("/api/auth/me").with(httpBasic("jimena.navarro", "111111")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("jimena.navarro"));
    }

    @Test
    void conCredencialesValidasSePuedeCrearUnaTarea() throws Exception {
        String json = "{\"titulo\":\"Desde test\",\"descripcion\":\"Integración\",\"estado\":\"Pendiente\"}";

        mockMvc.perform(post("/api/tareas")
                        .with(httpBasic("dario.mora", "444444"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.titulo").value("Desde test"));
    }

    @Test
    void lasPasswordsSeGuardanConBCrypt() {
        Usuario usuario = usuarioRepository.findByCorreo("dario.mora").orElseThrow();

        assertTrue(usuario.getPassword().startsWith("$2a$"));
        assertTrue(passwordEncoder.matches("444444", usuario.getPassword()));
    }

    @Test
    void corsPermiteElOrigenDeAngular() throws Exception {
        mockMvc.perform(options("/api/tareas")
                        .header("Origin", "http://localhost:4200")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
    }
}