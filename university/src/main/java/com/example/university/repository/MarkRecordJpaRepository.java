package com.example.university.repository;

import com.example.university.model.MarkRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarkRecordJpaRepository extends JpaRepository<MarkRecord, Integer> {

    List<MarkRecord> findByStudentEmailIgnoreCase(String email);

    long countByResult(String result);
}
