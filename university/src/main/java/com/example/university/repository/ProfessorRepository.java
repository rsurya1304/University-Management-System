package com.example.university.repository;

import com.example.university.model.Course;
import com.example.university.model.Professor;

import java.util.List;

public interface ProfessorRepository {

    // BASIC CRUD OPERATIONS

    List<Professor> getProfessors();

    Professor getProfessorById(int professorId);

    Professor addProfessor(Professor professor);

    Professor updateProfessor(int professorId, Professor professor);

    void deleteProfessor(int professorId);

    // RELATIONSHIP METHODS

    List<Course> getProfessorCourses(int professorId);

    // SEARCH METHODS

    List<Professor> searchProfessorsByName(String professorName);

    List<Professor> searchByDepartment(String department);

    // DASHBOARD METHODS

    long getProfessorsCount();
}