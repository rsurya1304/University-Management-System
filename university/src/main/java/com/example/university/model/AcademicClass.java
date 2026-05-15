package com.example.university.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "academic_class")
public class AcademicClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int classId;

    @Column(name = "name", nullable = false)
    private String className;

    @Column(name = "section", nullable = false)
    private String section;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({})
    private Department department;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    @JsonIgnoreProperties({"department"})
    private Semester semester;

    public int getClassId() {
        return classId;
    }

    public void setClassId(int classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }
}
