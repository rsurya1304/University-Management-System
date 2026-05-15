package com.example.university.model;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@Entity
@Table(name = "professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int professorId;

    @Column(name = "name", nullable = false)
    private String professorName;

    @Column(name = "department", nullable = false)
    private String department;

    @OneToMany(mappedBy = "professor")
    @JsonIgnoreProperties({
            "professor",
            "students"
    })
    private List<Course> courses;

    // DEFAULT CONSTRUCTOR
    public Professor() {
    }

    // GETTERS AND SETTERS

    public int getProfessorId() {
        return professorId;
    }

    public void setProfessorId(int professorId) {
        this.professorId = professorId;
    }

    public String getProfessorName() {
        return professorName;
    }

    public void setProfessorName(String professorName) {
        this.professorName = professorName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<Course> getCourses() {
        return courses;
    }

    public void setCourses(List<Course> courses) {
        this.courses = courses;
    }
}