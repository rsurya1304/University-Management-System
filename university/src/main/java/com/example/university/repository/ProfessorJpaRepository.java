package com.example.university.repository;

import com.example.university.model.Professor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfessorJpaRepository
        extends JpaRepository<Professor, Integer> {

    // SEARCH PROFESSOR BY NAME
    List<Professor> findByProfessorNameContainingIgnoreCase(
            String professorName
    );

    // SEARCH PROFESSOR BY DEPARTMENT
    List<Professor> findByDepartmentContainingIgnoreCase(
            String department
    );

    Optional<Professor> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    // TOTAL PROFESSORS COUNT
    long count();
}
