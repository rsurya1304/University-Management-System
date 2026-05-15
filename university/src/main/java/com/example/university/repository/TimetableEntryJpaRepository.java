package com.example.university.repository;

import com.example.university.model.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableEntryJpaRepository extends JpaRepository<TimetableEntry, Integer> {

    List<TimetableEntry> findByProfessorProfessorNameContainingIgnoreCase(String professorName);
}
