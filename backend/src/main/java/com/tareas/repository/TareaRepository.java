package com.tareas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tareas.model.Tarea;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
}