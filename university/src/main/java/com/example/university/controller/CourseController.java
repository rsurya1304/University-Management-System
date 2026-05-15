package com.example.university.controller;

import com.example.university.model.Course;
import com.example.university.model.Professor;
import com.example.university.model.Student;
import com.example.university.service.CourseJpaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseJpaService courseService;

    // GET ALL COURSES
    @GetMapping
    public List<Course> getCourses() {

        return courseService.getCourses();
    }

    // GET COURSE BY ID
    @GetMapping("/{courseId}")
    public Course getCourseById(
            @PathVariable int courseId) {

        return courseService.getCourseById(courseId);
    }

    // ADD COURSE
    @PostMapping
    public Course addCourse(
            @RequestBody Course course) {

        return courseService.addCourse(course);
    }

    // UPDATE COURSE
    @PutMapping("/{courseId}")
    public Course updateCourse(
            @PathVariable int courseId,
            @RequestBody Course course) {

        return courseService.updateCourse(
                courseId,
                course
        );
    }

    // DELETE COURSE
    @DeleteMapping("/{courseId}")
    public void deleteCourse(
            @PathVariable int courseId) {

        courseService.deleteCourse(courseId);
    }

    // GET COURSE PROFESSOR
    @GetMapping("/{courseId}/professor")
    public Professor getCourseProfessor(
            @PathVariable int courseId) {

        return courseService.getCourseProfessor(courseId);
    }

    // GET COURSE STUDENTS
    @GetMapping("/{courseId}/students")
    public List<Student> getCourseStudents(
            @PathVariable int courseId) {

        return courseService.getCourseStudents(courseId);
    }

    // SEARCH COURSES BY NAME
    @GetMapping("/search/name/{courseName}")
    public List<Course> searchCoursesByName(
            @PathVariable String courseName) {

        return courseService
                .searchCoursesByName(courseName);
    }

    // GET COURSES BY CREDITS
    @GetMapping("/credits/{credits}")
    public List<Course> getCoursesByCredits(
            @PathVariable int credits) {

        return courseService
                .getCoursesByCredits(credits);
    }

    // GET TOTAL COURSES COUNT
    @GetMapping("/count")
    public long getCoursesCount() {

        return courseService.getCoursesCount();
    }
}