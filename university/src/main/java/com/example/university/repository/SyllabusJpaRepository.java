package com.example.university.repository;

import com.example.university.model.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyllabusJpaRepository extends JpaRepository<Syllabus, Integer> {
}
