package com.example.university.repository;

import com.example.university.model.Fee;
import com.example.university.model.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeJpaRepository extends JpaRepository<Fee, Integer> {

    List<Fee> findByStudentEmailIgnoreCase(String email);

    long countByStatus(FeeStatus status);
}
