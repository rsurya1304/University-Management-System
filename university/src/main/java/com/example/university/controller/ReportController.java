package com.example.university.controller;

import com.example.university.model.FeeStatus;
import com.example.university.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final StudentJpaRepository studentRepository;
    private final ProfessorJpaRepository professorRepository;
    private final CourseJpaRepository courseRepository;
    private final FeeJpaRepository feeRepository;
    private final MarkRecordJpaRepository markRepository;
    private final TimetableEntryJpaRepository timetableRepository;

    public ReportController(
            StudentJpaRepository studentRepository,
            ProfessorJpaRepository professorRepository,
            CourseJpaRepository courseRepository,
            FeeJpaRepository feeRepository,
            MarkRecordJpaRepository markRepository,
            TimetableEntryJpaRepository timetableRepository) {

        this.studentRepository = studentRepository;
        this.professorRepository = professorRepository;
        this.courseRepository = courseRepository;
        this.feeRepository = feeRepository;
        this.markRepository = markRepository;
        this.timetableRepository = timetableRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalStudents", studentRepository.count());
        summary.put("totalProfessors", professorRepository.count());
        summary.put("totalCourses", courseRepository.count());
        summary.put("pendingFees", feeRepository.countByStatus(FeeStatus.PENDING));
        summary.put("overdueFees", feeRepository.countByStatus(FeeStatus.OVERDUE));
        summary.put("paidFees", feeRepository.countByStatus(FeeStatus.PAID));
        summary.put("passedResults", markRepository.countByResult("PASS"));
        summary.put("failedResults", markRepository.countByResult("FAIL"));
        summary.put("scheduledClasses", timetableRepository.count());
        return summary;
    }
}
