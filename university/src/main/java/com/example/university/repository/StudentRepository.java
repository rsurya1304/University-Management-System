package com.example.university.repository;

import com.example.university.model.Course;
import com.example.university.model.Student;

import java.util.List;

public interface StudentRepository {

    // BASIC CRUD OPERATIONS

    List<Student> getStudents();

    Student getStudentById(int studentId);

    Student addStudent(Student student);

    Student updateStudent(int studentId, Student student);

    void deleteStudent(int studentId);

    // RELATIONSHIP METHODS

    List<Course> getStudentCourses(int studentId);

    // SEARCH METHODS

    List<Student> searchStudentsByName(String studentName);

    List<Student> searchStudentsByEmail(String email);

    // VALIDATION METHODS

    boolean isEmailExists(String email);

    // DASHBOARD METHODS

    long getStudentsCount();
}