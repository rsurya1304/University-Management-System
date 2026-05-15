package com.example.university.service;

import com.example.university.model.Course;
import com.example.university.model.Professor;
import com.example.university.model.Student;

import com.example.university.repository.CourseJpaRepository;
import com.example.university.repository.ProfessorJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.repository.CourseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseJpaService implements CourseRepository {

    @Autowired
    private CourseJpaRepository courseJpaRepository;

    @Autowired
    private ProfessorJpaRepository professorJpaRepository;

    @Autowired
    private StudentJpaRepository studentJpaRepository;

    // GET ALL COURSES
    @Override
    public List<Course> getCourses() {

        try {

            return courseJpaRepository.findAll();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to fetch courses"
            );
        }
    }

    // GET COURSE BY ID
    @Override
    public Course getCourseById(int courseId) {

        try {

            return courseJpaRepository.findById(courseId).get();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found with id: " + courseId
            );
        }
    }

    // ADD COURSE
    @Override
    public Course addCourse(Course course) {

        try {

            // VALIDATE COURSE NAME
            if (course.getCourseName() == null ||
                    course.getCourseName().trim().isEmpty()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Course name is required"
                );
            }

            // HANDLE PROFESSOR
            if (course.getProfessor() != null) {

                int professorId =
                        course.getProfessor().getProfessorId();

                Professor professor =
                        professorJpaRepository.findById(professorId).get();

                course.setProfessor(professor);
            }

            // HANDLE STUDENTS
            if (course.getStudents() != null) {

                List<Integer> studentIds = new ArrayList<>();

                for (Student student : course.getStudents()) {
                    studentIds.add(student.getStudentId());
                }

                List<Student> students =
                        studentJpaRepository.findAllById(studentIds);

                if (students.size() != studentIds.size()) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid student ids provided"
                    );
                }

                course.setStudents(students);
            }

            return courseJpaRepository.save(course);

        } catch (ResponseStatusException e) {

            throw e;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unable to add course"
            );
        }
    }

    // UPDATE COURSE
    @Override
    public Course updateCourse(int courseId, Course course) {

        try {

            Course existingCourse =
                    courseJpaRepository.findById(courseId).get();

            // UPDATE COURSE NAME
            if (course.getCourseName() != null) {

                existingCourse.setCourseName(course.getCourseName());
            }

            // UPDATE CREDITS
            if (course.getCredits() != 0) {

                existingCourse.setCredits(course.getCredits());
            }

            // UPDATE PROFESSOR
            if (course.getProfessor() != null) {

                int professorId =
                        course.getProfessor().getProfessorId();

                Professor professor =
                        professorJpaRepository.findById(professorId).get();

                existingCourse.setProfessor(professor);
            }

            // UPDATE STUDENTS
            if (course.getStudents() != null) {

                // REMOVE OLD RELATIONSHIPS
                if (existingCourse.getStudents() != null) {

                    for (Student student : existingCourse.getStudents()) {

                        student.getCourses().remove(existingCourse);
                    }

                    studentJpaRepository.saveAll(
                            existingCourse.getStudents()
                    );
                }

                // ADD NEW STUDENTS
                List<Integer> studentIds = new ArrayList<>();

                for (Student student : course.getStudents()) {

                    studentIds.add(student.getStudentId());
                }

                List<Student> newStudents =
                        studentJpaRepository.findAllById(studentIds);

                if (newStudents.size() != studentIds.size()) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid student ids provided"
                    );
                }

                for (Student student : newStudents) {

                    if (!student.getCourses().contains(existingCourse)) {

                        student.getCourses().add(existingCourse);
                    }
                }

                studentJpaRepository.saveAll(newStudents);

                existingCourse.setStudents(newStudents);
            }

            return courseJpaRepository.save(existingCourse);

        } catch (ResponseStatusException e) {

            throw e;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found with id: " + courseId
            );
        }
    }

    // DELETE COURSE
    @Override
    public void deleteCourse(int courseId) {

        try {

            Course course =
                    courseJpaRepository.findById(courseId).get();

            // REMOVE RELATIONSHIPS
            if (course.getStudents() != null) {

                for (Student student : course.getStudents()) {

                    student.getCourses().remove(course);
                }

                studentJpaRepository.saveAll(course.getStudents());
            }

            // DELETE COURSE
            courseJpaRepository.delete(course);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found with id: " + courseId
            );
        }
    }

    // GET COURSE PROFESSOR
    @Override
    public Professor getCourseProfessor(int courseId) {

        try {

            Course course =
                    courseJpaRepository.findById(courseId).get();

            return course.getProfessor();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found with id: " + courseId
            );
        }
    }

    // GET COURSE STUDENTS
    @Override
    public List<Student> getCourseStudents(int courseId) {

        try {

            Course course =
                    courseJpaRepository.findById(courseId).get();

            return course.getStudents();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found with id: " + courseId
            );
        }
    }

    // SEARCH COURSES BY NAME
    @Override
    public List<Course> searchCoursesByName(String courseName) {

        try {

            return courseJpaRepository
                    .findByCourseNameContainingIgnoreCase(courseName);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to search courses"
            );
        }
    }

    // GET COURSES BY CREDITS
    @Override
    public List<Course> getCoursesByCredits(int credits) {

        try {

            return courseJpaRepository.findByCredits(credits);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to fetch courses by credits"
            );
        }
    }

    // TOTAL COURSES COUNT
    @Override
    public long getCoursesCount() {

        try {

            return courseJpaRepository.count();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to get courses count"
            );
        }
    }
}