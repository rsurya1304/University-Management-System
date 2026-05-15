package com.example.university.service;

import com.example.university.model.Course;
import com.example.university.model.Student;
import com.example.university.repository.CourseJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentJpaService implements StudentRepository {

    @Autowired
    private StudentJpaRepository studentJpaRepository;

    @Autowired
    private CourseJpaRepository courseJpaRepository;

    // GET ALL STUDENTS
    @Override
    public List<Student> getStudents() {

        try {
            return studentJpaRepository.findAll();

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to fetch students"
            );
        }
    }

    // GET STUDENT BY ID
    @Override
    public Student getStudentById(int studentId) {

        try {

            return studentJpaRepository.findById(studentId).get();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Student not found with id: " + studentId
            );
        }
    }

    // ADD STUDENT
    @Override
    public Student addStudent(Student student) {

        try {

            // EMAIL VALIDATION
            if (student.getEmail() != null &&
                    studentJpaRepository.existsByEmail(student.getEmail())) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Email already exists"
                );
            }

            List<Course> courses = new ArrayList<>();

            // HANDLE COURSES
            if (student.getCourses() != null) {

                List<Integer> courseIds = new ArrayList<>();

                for (Course course : student.getCourses()) {
                    courseIds.add(course.getCourseId());
                }

                courses = courseJpaRepository.findAllById(courseIds);

                if (courses.size() != courseIds.size()) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid course ids provided"
                    );
                }
            }

            // SAVE STUDENT
            Student savedStudent = studentJpaRepository.save(student);

            // UPDATE RELATIONSHIPS
            for (Course course : courses) {

                if (!course.getStudents().contains(savedStudent)) {
                    course.getStudents().add(savedStudent);
                }
            }

            courseJpaRepository.saveAll(courses);

            savedStudent.setCourses(courses);

            return studentJpaRepository.save(savedStudent);

        } catch (ResponseStatusException e) {

            throw e;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to add student"
            );
        }
    }

    // UPDATE STUDENT
    @Override
    public Student updateStudent(int studentId, Student student) {

        try {

            Student existingStudent =
                    studentJpaRepository.findById(studentId).get();

            // UPDATE NAME
            if (student.getStudentName() != null) {
                existingStudent.setStudentName(student.getStudentName());
            }

            // UPDATE EMAIL
            if (student.getEmail() != null) {
                existingStudent.setEmail(student.getEmail());
            }

            // UPDATE COURSES
            if (student.getCourses() != null) {

                // REMOVE OLD COURSE LINKS
                if (existingStudent.getCourses() != null) {

                    for (Course course : existingStudent.getCourses()) {
                        course.getStudents().remove(existingStudent);
                    }

                    courseJpaRepository.saveAll(existingStudent.getCourses());
                }

                // ADD NEW COURSE LINKS
                List<Integer> courseIds = new ArrayList<>();

                for (Course course : student.getCourses()) {
                    courseIds.add(course.getCourseId());
                }

                List<Course> newCourses =
                        courseJpaRepository.findAllById(courseIds);

                if (newCourses.size() != courseIds.size()) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid course ids provided"
                    );
                }

                for (Course course : newCourses) {

                    if (!course.getStudents().contains(existingStudent)) {
                        course.getStudents().add(existingStudent);
                    }
                }

                courseJpaRepository.saveAll(newCourses);

                existingStudent.setCourses(newCourses);
            }

            return studentJpaRepository.save(existingStudent);

        } catch (ResponseStatusException e) {

            throw e;

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Student not found with id: " + studentId
            );
        }
    }

    // DELETE STUDENT
    @Override
    public void deleteStudent(int studentId) {

        try {

            Student student =
                    studentJpaRepository.findById(studentId).get();

            // REMOVE RELATIONSHIPS
            if (student.getCourses() != null) {

                for (Course course : student.getCourses()) {
                    course.getStudents().remove(student);
                }

                courseJpaRepository.saveAll(student.getCourses());
            }

            // DELETE STUDENT
            studentJpaRepository.delete(student);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Student not found with id: " + studentId
            );
        }
    }

    // GET STUDENT COURSES
    @Override
    public List<Course> getStudentCourses(int studentId) {

        try {

            Student student =
                    studentJpaRepository.findById(studentId).get();

            return student.getCourses();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Student not found with id: " + studentId
            );
        }
    }

    // SEARCH STUDENTS BY NAME
    @Override
    public List<Student> searchStudentsByName(String studentName) {

        try {

            return studentJpaRepository
                    .findByStudentNameContainingIgnoreCase(studentName);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to search students"
            );
        }
    }

    // SEARCH STUDENTS BY EMAIL
    @Override
    public List<Student> searchStudentsByEmail(String email) {

        try {

            return studentJpaRepository
                    .findByEmailContainingIgnoreCase(email);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to search students"
            );
        }
    }

    // TOTAL STUDENTS COUNT
    @Override
    public long getStudentsCount() {

        try {

            return studentJpaRepository.count();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to get students count"
            );
        }
    }

    // CHECK EMAIL EXISTS
    @Override
    public boolean isEmailExists(String email) {

        try {

            return studentJpaRepository.existsByEmail(email);

        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to check email"
            );
        }
    }
}