package com.tareas.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.tareas.model.Usuario;
import com.tareas.repository.UsuarioRepository;
import com.tareas.security.UsuarioDetailsService;

@ExtendWith(MockitoExtension.class)
public class UsuarioDetailsServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioDetailsService usuarioDetailsService;

    @Test
    void cargaUsuarioExistente() {
        Usuario usuario = new Usuario("dario.mora", "$2a$10$hashDeEjemplo");
        when(usuarioRepository.findByCorreo("dario.mora")).thenReturn(Optional.of(usuario));

        UserDetails detalles = usuarioDetailsService.loadUserByUsername("dario.mora");

        assertEquals("dario.mora", detalles.getUsername());
        assertEquals("$2a$10$hashDeEjemplo", detalles.getPassword());
        assertEquals("ROLE_USER", detalles.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void lanzaExcepcionSiElUsuarioNoExiste() {
        when(usuarioRepository.findByCorreo("nadie")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> usuarioDetailsService.loadUserByUsername("nadie"));
    }
}