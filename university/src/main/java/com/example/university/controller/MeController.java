package com.example.university.controller;

import com.example.university.model.Fee;
import com.example.university.model.MarkRecord;
import com.example.university.model.Student;
import com.example.university.repository.FeeJpaRepository;
import com.example.university.repository.MarkRecordJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.security.AuthInterceptor;
import com.example.university.security.AuthUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/me")
public class MeController {

    private final StudentJpaRepository studentRepository;
    private final FeeJpaRepository feeRepository;
    private final MarkRecordJpaRepository markRepository;

    public MeController(
            StudentJpaRepository studentRepository,
            FeeJpaRepository feeRepository,
            MarkRecordJpaRepository markRepository) {

        this.studentRepository = studentRepository;
        this.feeRepository = feeRepository;
        this.markRepository = markRepository;
    }

    @GetMapping("/student")
    public Student getMyStudentProfile(HttpServletRequest request) {
        return studentRepository
                .findByEmailContainingIgnoreCase(currentUser(request).getEmail())
                .stream()
                .filter(student -> student.getEmail().equalsIgnoreCase(currentUser(request).getEmail()))
                .findFirst()
                .orElseThrow();
    }

    @GetMapping("/fees")
    public List<Fee> getMyFees(HttpServletRequest request) {
        return feeRepository.findByStudentEmailIgnoreCase(currentUser(request).getEmail());
    }

    @GetMapping("/marks")
    public List<MarkRecord> getMyMarks(HttpServletRequest request) {
        return markRepository.findByStudentEmailIgnoreCase(currentUser(request).getEmail());
    }

    private AuthUser currentUser(HttpServletRequest request) {
        return (AuthUser) request.getAttribute(AuthInterceptor.AUTH_USER_ATTRIBUTE);
    }
}
