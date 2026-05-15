package com.example.university.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "mark_record")
public class MarkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int markId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"courses"})
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"students"})
    private Course course;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    @JsonIgnoreProperties({"department"})
    private Semester semester;

    @Column(name = "marks", nullable = false)
    private BigDecimal marks;

    @Column(name = "percentage", nullable = false)
    private BigDecimal percentage;

    @Column(name = "grade", nullable = false)
    private String grade;

    @Column(name = "result", nullable = false)
    private String result;

    @PrePersist
    @PreUpdate
    public void calculateResult() {
        if (marks == null) {
            marks = BigDecimal.ZERO;
        }

        percentage = marks.setScale(2, RoundingMode.HALF_UP);
        double value = percentage.doubleValue();
        result = value >= 40 ? "PASS" : "FAIL";

        if (value >= 90) {
            grade = "A+";
        } else if (value >= 80) {
            grade = "A";
        } else if (value >= 70) {
            grade = "B+";
        } else if (value >= 60) {
            grade = "B";
        } else if (value >= 50) {
            grade = "C";
        } else if (value >= 40) {
            grade = "D";
        } else {
            grade = "F";
        }
    }

    public int getMarkId() {
        return markId;
    }

    public void setMarkId(int markId) {
        this.markId = markId;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public BigDecimal getMarks() {
        return marks;
    }

    public void setMarks(BigDecimal marks) {
        this.marks = marks;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}
