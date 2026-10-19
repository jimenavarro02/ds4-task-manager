package com.tareas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    // Redirige cualquier ruta que no sea API o recursos estáticos hacia Angular
    @RequestMapping(value = { "/", "/login", "/tareas", "/dashboard", "/{path:[^\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}