package com.example.university.controller;

import com.example.university.model.Course;
import com.example.university.model.Professor;
import com.example.university.service.ProfessorJpaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professors")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessorController {

    @Autowired
    private ProfessorJpaService professorService;

    // GET ALL PROFESSORS
    @GetMapping
    public List<Professor> getProfessors() {

        return professorService.getProfessors();
    }

    // GET PROFESSOR BY ID
    @GetMapping("/{professorId}")
    public Professor getProfessorById(
            @PathVariable int professorId) {

        return professorService.getProfessorById(professorId);
    }

    // ADD PROFESSOR
    @PostMapping
    public Professor addProfessor(
            @RequestBody Professor professor) {

        return professorService.addProfessor(professor);
    }

    // UPDATE PROFESSOR
    @PutMapping("/{professorId}")
    public Professor updateProfessor(
            @PathVariable int professorId,
            @RequestBody Professor professor) {

        return professorService.updateProfessor(
                professorId,
                professor
        );
    }

    // DELETE PROFESSOR
    @DeleteMapping("/{professorId}")
    public void deleteProfessor(
            @PathVariable int professorId) {

        professorService.deleteProfessor(professorId);
    }

    // GET PROFESSOR COURSES
    @GetMapping("/{professorId}/courses")
    public List<Course> getProfessorCourses(
            @PathVariable int professorId) {

        return professorService.getProfessorCourses(professorId);
    }

    // SEARCH PROFESSORS BY NAME
    @GetMapping("/search/name/{professorName}")
    public List<Professor> searchProfessorsByName(
            @PathVariable String professorName) {

        return professorService
                .searchProfessorsByName(professorName);
    }

    // SEARCH PROFESSORS BY DEPARTMENT
    @GetMapping("/search/department/{department}")
    public List<Professor> searchByDepartment(
            @PathVariable String department) {

        return professorService
                .searchByDepartment(department);
    }

    // GET TOTAL PROFESSORS COUNT
    @GetMapping("/count")
    public long getProfessorsCount() {

        return professorService.getProfessorsCount();
    }
}