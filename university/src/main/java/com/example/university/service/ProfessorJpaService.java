package com.example.university.service;

import com.example.university.model.Course;
import com.example.university.model.Professor;
import com.example.university.repository.CourseJpaRepository;
import com.example.university.repository.ProfessorJpaRepository;
import com.example.university.repository.ProfessorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfessorJpaService implements ProfessorRepository {

    @Autowired
    private ProfessorJpaRepository professorJpaRepository;

    @Autowired
    private CourseJpaRepository courseJpaRepository;

    // GET ALL PROFESSORS
    @Override
    public List<Professor> getProfessors() {

        try {

            return professorJpaRepository.findAll();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to fetch professors"
            );
        }
    }

    // GET PROFESSOR BY ID
    @Override
    public Professor getProfessorById(int professorId) {

        try {

            return professorJpaRepository.findById(professorId).get();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Professor not found with id: " + professorId
            );
        }
    }

    // ADD PROFESSOR
    @Override
    public Professor addProfessor(Professor professor) {

        try {

            if (professor.getProfessorName() == null ||
                    professor.getProfessorName().trim().isEmpty()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Professor name is required"
                );
            }

            return professorJpaRepository.save(professor);

        } catch (ResponseStatusException e) {

            throw e;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unable to add professor"
            );
        }
    }

    // UPDATE PROFESSOR
    @Override
    public Professor updateProfessor(int professorId, Professor professor) {

        try {

            Professor existingProfessor =
                    professorJpaRepository.findById(professorId).get();

            // UPDATE NAME
            if (professor.getProfessorName() != null) {

                existingProfessor
                        .setProfessorName(professor.getProfessorName());
            }

            // UPDATE DEPARTMENT
            if (professor.getDepartment() != null) {

                existingProfessor
                        .setDepartment(professor.getDepartment());
            }

            return professorJpaRepository.save(existingProfessor);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Professor not found with id: " + professorId
            );
        }
    }

    // DELETE PROFESSOR
    @Override
    public void deleteProfessor(int professorId) {

        try {

            Professor professor =
                    professorJpaRepository.findById(professorId).get();

            // REMOVE PROFESSOR FROM COURSES
            List<Course> courses = courseJpaRepository.findAll();

            for (Course course : courses) {

                if (course.getProfessor() != null &&
                        course.getProfessor().getProfessorId() == professorId) {

                    course.setProfessor(null);
                }
            }

            courseJpaRepository.saveAll(courses);

            // DELETE PROFESSOR
            professorJpaRepository.delete(professor);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Professor not found with id: " + professorId
            );
        }
    }

    // GET PROFESSOR COURSES
    @Override
    public List<Course> getProfessorCourses(int professorId) {

        try {

            professorJpaRepository.findById(professorId).get();

            List<Course> result = new ArrayList<>();

            List<Course> courses = courseJpaRepository.findAll();

            for (Course course : courses) {

                if (course.getProfessor() != null &&
                        course.getProfessor().getProfessorId() == professorId) {

                    result.add(course);
                }
            }

            return result;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Professor not found with id: " + professorId
            );
        }
    }

    // SEARCH PROFESSORS BY NAME
    @Override
    public List<Professor> searchProfessorsByName(String professorName) {

        try {

            return professorJpaRepository
                    .findByProfessorNameContainingIgnoreCase(professorName);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to search professors"
            );
        }
    }

    // SEARCH PROFESSORS BY DEPARTMENT
    @Override
    public List<Professor> searchByDepartment(String department) {

        try {

            return professorJpaRepository
                    .findByDepartmentContainingIgnoreCase(department);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to search department"
            );
        }
    }

    // TOTAL PROFESSORS COUNT
    @Override
    public long getProfessorsCount() {

        try {

            return professorJpaRepository.count();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to get professors count"
            );
        }
    }
}