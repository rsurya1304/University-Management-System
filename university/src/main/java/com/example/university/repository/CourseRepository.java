package com.example.university.repository;

import com.example.university.model.Course;
import com.example.university.model.Professor;
import com.example.university.model.Student;

import java.util.List;

public interface CourseRepository {

    // BASIC CRUD OPERATIONS

    List<Course> getCourses();

    Course getCourseById(int courseId);

    Course addCourse(Course course);

    Course updateCourse(int courseId, Course course);

    void deleteCourse(int courseId);

    // RELATIONSHIP METHODS

    Professor getCourseProfessor(int courseId);

    List<Student> getCourseStudents(int courseId);

    // SEARCH METHODS

    List<Course> searchCoursesByName(String courseName);

    List<Course> getCoursesByCredits(int credits);

    // DASHBOARD METHODS

    long getCoursesCount();
}