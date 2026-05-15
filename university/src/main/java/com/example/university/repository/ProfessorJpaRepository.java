package com.example.university.repository;

import com.example.university.model.Professor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

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

    // TOTAL PROFESSORS COUNT
    long count();
}