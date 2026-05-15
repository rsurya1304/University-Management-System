package com.example.university.repository;

import com.example.university.model.Student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentJpaRepository
        extends JpaRepository<Student, Integer> {

    // SEARCH BY STUDENT NAME
    List<Student> findByStudentNameContainingIgnoreCase(
            String studentName
    );

    // SEARCH BY EMAIL
    List<Student> findByEmailContainingIgnoreCase(
            String email
    );

    // CHECK EMAIL EXISTS
    boolean existsByEmail(String email);

    // TOTAL STUDENTS COUNT
    long count();
}