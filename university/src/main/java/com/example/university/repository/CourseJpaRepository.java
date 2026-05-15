package com.example.university.repository;

import com.example.university.model.Course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseJpaRepository
        extends JpaRepository<Course, Integer> {

    // SEARCH COURSE BY NAME
    List<Course> findByCourseNameContainingIgnoreCase(
            String courseName
    );

    // FILTER COURSES BY CREDITS
    List<Course> findByCredits(int credits);

    // TOTAL COURSES COUNT
    long count();
}