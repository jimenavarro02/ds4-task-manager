package com.tareas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Las rutas de Angular (/login, /tareas) no existen en el servidor.
 * Si el usuario recarga la página o entra directo a ellas, devolvemos index.html
 * para que Angular resuelva la ruta en el navegador.
 */
@Controller
public class SpaController {

    @GetMapping({"/login", "/tareas"})
    public String forward() {
        return "forward:/index.html";
    }
}
