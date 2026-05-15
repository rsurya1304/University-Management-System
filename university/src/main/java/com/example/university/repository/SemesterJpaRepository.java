package com.example.university.repository;

import com.example.university.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterJpaRepository extends JpaRepository<Semester, Integer> {
}
