package com.example.university.controller;

import com.example.university.model.Course;
import com.example.university.model.Student;
import com.example.university.service.StudentJpaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentJpaService studentService;

    // GET ALL STUDENTS
    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    // GET STUDENT BY ID
    @GetMapping("/{studentId}")
    public Student getStudentById(@PathVariable int studentId) {
        return studentService.getStudentById(studentId);
    }

    // ADD STUDENT
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    // UPDATE STUDENT
    @PutMapping("/{studentId}")
    public Student updateStudent(
            @PathVariable int studentId,
            @RequestBody Student student) {

        return studentService.updateStudent(studentId, student);
    }

    // DELETE STUDENT
    @DeleteMapping("/{studentId}")
    public void deleteStudent(@PathVariable int studentId) {
        studentService.deleteStudent(studentId);
    }

    // GET STUDENT COURSES
    @GetMapping("/{studentId}/courses")
    public List<Course> getStudentCourses(
            @PathVariable int studentId) {

        return studentService.getStudentCourses(studentId);
    }

    // SEARCH STUDENTS BY NAME
    @GetMapping("/search/name/{studentName}")
    public List<Student> searchStudentsByName(
            @PathVariable String studentName) {

        return studentService.searchStudentsByName(studentName);
    }

    // SEARCH STUDENTS BY EMAIL
    @GetMapping("/search/email/{email}")
    public List<Student> searchStudentsByEmail(
            @PathVariable String email) {

        return studentService.searchStudentsByEmail(email);
    }

    // GET TOTAL STUDENTS COUNT
    @GetMapping("/count")
    public long getStudentsCount() {

        return studentService.getStudentsCount();
    }

    // CHECK EMAIL EXISTS
    @GetMapping("/exists/{email}")
    public boolean isEmailExists(
            @PathVariable String email) {

        return studentService.isEmailExists(email);
    }
}