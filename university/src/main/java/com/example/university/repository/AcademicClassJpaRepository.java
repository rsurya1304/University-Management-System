package com.example.university.repository;

import com.example.university.model.AcademicClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicClassJpaRepository extends JpaRepository<AcademicClass, Integer> {
}
