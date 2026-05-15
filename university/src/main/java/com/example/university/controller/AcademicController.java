package com.example.university.controller;

import com.example.university.model.*;
import com.example.university.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AcademicController {

    private final DepartmentJpaRepository departmentRepository;
    private final SemesterJpaRepository semesterRepository;
    private final AcademicClassJpaRepository classRepository;
    private final SyllabusJpaRepository syllabusRepository;

    public AcademicController(
            DepartmentJpaRepository departmentRepository,
            SemesterJpaRepository semesterRepository,
            AcademicClassJpaRepository classRepository,
            SyllabusJpaRepository syllabusRepository) {

        this.departmentRepository = departmentRepository;
        this.semesterRepository = semesterRepository;
        this.classRepository = classRepository;
        this.syllabusRepository = syllabusRepository;
    }

    @GetMapping("/departments")
    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }

    @PostMapping("/departments")
    public Department addDepartment(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @PutMapping("/departments/{id}")
    public Department updateDepartment(@PathVariable int id, @RequestBody Department department) {
        Department existingDepartment = departmentRepository.findById(id).orElseThrow();
        existingDepartment.setDepartmentName(department.getDepartmentName());
        existingDepartment.setCode(department.getCode());
        return departmentRepository.save(existingDepartment);
    }

    @DeleteMapping("/departments/{id}")
    public void deleteDepartment(@PathVariable int id) {
        departmentRepository.deleteById(id);
    }

    @GetMapping("/semesters")
    public List<Semester> getSemesters() {
        return semesterRepository.findAll();
    }

    @PostMapping("/semesters")
    public Semester addSemester(@RequestBody Semester semester) {
        return semesterRepository.save(semester);
    }

    @PutMapping("/semesters/{id}")
    public Semester updateSemester(@PathVariable int id, @RequestBody Semester semester) {
        Semester existingSemester = semesterRepository.findById(id).orElseThrow();
        existingSemester.setSemesterName(semester.getSemesterName());
        existingSemester.setSemesterNumber(semester.getSemesterNumber());
        existingSemester.setDepartment(semester.getDepartment());
        return semesterRepository.save(existingSemester);
    }

    @DeleteMapping("/semesters/{id}")
    public void deleteSemester(@PathVariable int id) {
        semesterRepository.deleteById(id);
    }

    @GetMapping("/classes")
    public List<AcademicClass> getClasses() {
        return classRepository.findAll();
    }

    @PostMapping("/classes")
    public AcademicClass addClass(@RequestBody AcademicClass academicClass) {
        return classRepository.save(academicClass);
    }

    @PutMapping("/classes/{id}")
    public AcademicClass updateClass(@PathVariable int id, @RequestBody AcademicClass academicClass) {
        AcademicClass existingClass = classRepository.findById(id).orElseThrow();
        existingClass.setClassName(academicClass.getClassName());
        existingClass.setSection(academicClass.getSection());
        existingClass.setDepartment(academicClass.getDepartment());
        existingClass.setSemester(academicClass.getSemester());
        return classRepository.save(existingClass);
    }

    @DeleteMapping("/classes/{id}")
    public void deleteClass(@PathVariable int id) {
        classRepository.deleteById(id);
    }

    @GetMapping("/syllabi")
    public List<Syllabus> getSyllabi() {
        return syllabusRepository.findAll();
    }

    @PostMapping("/syllabi")
    public Syllabus addSyllabus(@RequestBody Syllabus syllabus) {
        return syllabusRepository.save(syllabus);
    }

    @PutMapping("/syllabi/{id}")
    public Syllabus updateSyllabus(@PathVariable int id, @RequestBody Syllabus syllabus) {
        Syllabus existingSyllabus = syllabusRepository.findById(id).orElseThrow();
        existingSyllabus.setTitle(syllabus.getTitle());
        existingSyllabus.setDescription(syllabus.getDescription());
        existingSyllabus.setCourse(syllabus.getCourse());
        existingSyllabus.setSemester(syllabus.getSemester());
        return syllabusRepository.save(existingSyllabus);
    }

    @DeleteMapping("/syllabi/{id}")
    public void deleteSyllabus(@PathVariable int id) {
        syllabusRepository.deleteById(id);
    }
}
