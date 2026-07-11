package com.example.university.controller;

import com.example.university.model.Course;
import com.example.university.model.Fee;
import com.example.university.model.MarkRecord;
import com.example.university.model.Student;
import com.example.university.repository.CourseJpaRepository;
import com.example.university.repository.FeeJpaRepository;
import com.example.university.repository.MarkRecordJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.security.AuthInterceptor;
import com.example.university.security.AuthUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/me")
public class MeController {

    private final StudentJpaRepository studentRepository;
    private final CourseJpaRepository courseRepository;
    private final FeeJpaRepository feeRepository;
    private final MarkRecordJpaRepository markRepository;

    public MeController(
            StudentJpaRepository studentRepository,
            CourseJpaRepository courseRepository,
            FeeJpaRepository feeRepository,
            MarkRecordJpaRepository markRepository) {

        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.feeRepository = feeRepository;
        this.markRepository = markRepository;
    }

    @GetMapping("/student")
    public Student getMyStudentProfile(HttpServletRequest request) {
        return studentRepository
                .findByEmailIgnoreCase(currentUser(request).getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found for current user"
                ));
    }

    @GetMapping("/fees")
    public List<Fee> getMyFees(HttpServletRequest request) {
        return feeRepository.findByStudentEmailIgnoreCase(currentUser(request).getEmail());
    }

    @GetMapping("/marks")
    public List<MarkRecord> getMyMarks(HttpServletRequest request) {
        return markRepository.findByStudentEmailIgnoreCase(currentUser(request).getEmail());
    }

    @GetMapping("/courses")
    public List<Course> getMyCourses(HttpServletRequest request) {
        return currentStudent(request).getCourses();
    }

    @PostMapping("/courses/{courseId}")
    public Course registerCourse(HttpServletRequest request, @PathVariable int courseId) {
        Student student = currentStudent(request);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found with id: " + courseId
                ));

        if (course.getStudents() == null) {
            course.setStudents(new java.util.ArrayList<>());
        }

        boolean alreadyRegistered = course.getStudents().stream()
                .anyMatch(existingStudent -> existingStudent.getStudentId() == student.getStudentId());

        if (alreadyRegistered) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You are already registered for this course"
            );
        }

        course.getStudents().add(student);
        return courseRepository.save(course);
    }

    @DeleteMapping("/courses/{courseId}")
    public void withdrawCourse(HttpServletRequest request, @PathVariable int courseId) {
        Student student = currentStudent(request);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found with id: " + courseId
                ));

        if (course.getStudents() != null) {
            course.getStudents().removeIf(existingStudent ->
                    existingStudent.getStudentId() == student.getStudentId());
            courseRepository.save(course);
        }
    }

    private AuthUser currentUser(HttpServletRequest request) {
        return (AuthUser) request.getAttribute(AuthInterceptor.AUTH_USER_ATTRIBUTE);
    }

    private Student currentStudent(HttpServletRequest request) {
        AuthUser authUser = currentUser(request);
        if (!"STUDENT".equals(authUser.getAccessLevel())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only student accounts can use this self-service endpoint"
            );
        }

        return studentRepository
                .findByEmailIgnoreCase(authUser.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student profile not found for current user"
                ));
    }
}
