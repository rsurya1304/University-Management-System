package com.example.university.config;

import com.example.university.model.AcademicClass;
import com.example.university.model.AccessLevel;
import com.example.university.model.Course;
import com.example.university.model.Department;
import com.example.university.model.Fee;
import com.example.university.model.FeeStatus;
import com.example.university.model.MarkRecord;
import com.example.university.model.Professor;
import com.example.university.model.Semester;
import com.example.university.model.Student;
import com.example.university.model.Syllabus;
import com.example.university.model.TimetableEntry;
import com.example.university.model.UserAccount;
import com.example.university.repository.AcademicClassJpaRepository;
import com.example.university.repository.CourseJpaRepository;
import com.example.university.repository.DepartmentJpaRepository;
import com.example.university.repository.FeeJpaRepository;
import com.example.university.repository.MarkRecordJpaRepository;
import com.example.university.repository.ProfessorJpaRepository;
import com.example.university.repository.SemesterJpaRepository;
import com.example.university.repository.StudentJpaRepository;
import com.example.university.repository.SyllabusJpaRepository;
import com.example.university.repository.TimetableEntryJpaRepository;
import com.example.university.repository.UserAccountJpaRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Component
public class DemoDataInitializer implements ApplicationRunner {

    private final AcademicClassJpaRepository classRepository;
    private final CourseJpaRepository courseRepository;
    private final DepartmentJpaRepository departmentRepository;
    private final FeeJpaRepository feeRepository;
    private final MarkRecordJpaRepository markRepository;
    private final ProfessorJpaRepository professorRepository;
    private final SemesterJpaRepository semesterRepository;
    private final StudentJpaRepository studentRepository;
    private final SyllabusJpaRepository syllabusRepository;
    private final TimetableEntryJpaRepository timetableRepository;
    private final UserAccountJpaRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DemoDataInitializer(
            AcademicClassJpaRepository classRepository,
            CourseJpaRepository courseRepository,
            DepartmentJpaRepository departmentRepository,
            FeeJpaRepository feeRepository,
            MarkRecordJpaRepository markRepository,
            ProfessorJpaRepository professorRepository,
            SemesterJpaRepository semesterRepository,
            StudentJpaRepository studentRepository,
            SyllabusJpaRepository syllabusRepository,
            TimetableEntryJpaRepository timetableRepository,
            UserAccountJpaRepository userRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.departmentRepository = departmentRepository;
        this.feeRepository = feeRepository;
        this.markRepository = markRepository;
        this.professorRepository = professorRepository;
        this.semesterRepository = semesterRepository;
        this.studentRepository = studentRepository;
        this.syllabusRepository = syllabusRepository;
        this.timetableRepository = timetableRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        List<Professor> professors = seedProfessors();
        List<Student> students = seedStudents();
        List<Course> courses = seedCourses(professors, students);
        List<Department> departments = seedDepartments();
        List<Semester> semesters = seedSemesters(departments);
        List<AcademicClass> classes = seedClasses(departments, semesters);
        seedSyllabi(courses, semesters);
        seedFees(students);
        seedMarks(students, courses, semesters);
        seedTimetable(courses, professors, classes);
    }

    private void seedUsers() {
        createUserIfMissing("Admin User", "admin@university.edu", "admin123", AccessLevel.ADMIN);
        createUserIfMissing("Registrar User", "registrar@university.edu", "registrar123", AccessLevel.REGISTRAR);
        createUserIfMissing("Professor User", "professor@university.edu", "professor123", AccessLevel.PROFESSOR);
        createUserIfMissing("Student User", "student@university.edu", "student123", AccessLevel.STUDENT);
    }

    private void createUserIfMissing(String fullName, String email, String password, AccessLevel accessLevel) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        UserAccount userAccount = new UserAccount();
        userAccount.setFullName(fullName);
        userAccount.setEmail(email);
        userAccount.setPasswordHash(passwordEncoder.encode(password));
        userAccount.setAccessLevel(accessLevel);
        userRepository.save(userAccount);
    }

    private List<Professor> seedProfessors() {
        if (professorRepository.count() > 0) {
            return professors();
        }

        List<Professor> professors = Arrays.asList(
                professor("John Smith", "Computer Science"),
                professor("Mary Johnson", "Physics"),
                professor("David Lee", "Mathematics"),
                professor("Robert Brown", "Chemistry"),
                professor("Linda Wilson", "Biology"),
                professor("James Taylor", "Mechanical Engineering"),
                professor("Sophia Anderson", "Electronics"),
                professor("Michael Thomas", "Civil Engineering"),
                professor("Emma Martinez", "Artificial Intelligence"),
                professor("Daniel White", "Data Science"),
                professor("Priya Nair", "Cybersecurity"),
                professor("Arjun Mehta", "Information Technology"),
                professor("Kavya Rao", "Business Analytics"),
                professor("Nisha Iyer", "English and Communication"),
                professor("Vikram Patel", "Robotics"),
                professor("Farah Khan", "Environmental Science")
        );
        return professorRepository.saveAll(professors);
    }

    private List<Student> seedStudents() {
        if (studentRepository.count() > 0) {
            return students();
        }

        List<Student> students = Arrays.asList(
                student("Alice Johnson", "alice.johnson@university.edu"),
                student("Bob Davis", "bob.davis@university.edu"),
                student("Eva Wilson", "eva.wilson@university.edu"),
                student("Chris Martin", "chris.martin@university.edu"),
                student("Sophia Clark", "sophia.clark@university.edu"),
                student("Liam Walker", "liam.walker@university.edu"),
                student("Olivia Hall", "olivia.hall@university.edu"),
                student("Noah Allen", "noah.allen@university.edu"),
                student("Mia Young", "mia.young@university.edu"),
                student("William King", "william.king@university.edu"),
                student("Charlotte Scott", "charlotte.scott@university.edu"),
                student("Benjamin Green", "benjamin.green@university.edu"),
                student("Amelia Baker", "amelia.baker@university.edu"),
                student("Elijah Adams", "elijah.adams@university.edu"),
                student("Harper Nelson", "harper.nelson@university.edu"),
                student("Aarav Sharma", "aarav.sharma@university.edu"),
                student("Ananya Reddy", "ananya.reddy@university.edu"),
                student("Vivaan Kapoor", "vivaan.kapoor@university.edu"),
                student("Isha Verma", "isha.verma@university.edu"),
                student("Rohan Gupta", "rohan.gupta@university.edu"),
                student("Meera Joshi", "meera.joshi@university.edu"),
                student("Kiran Rao", "kiran.rao@university.edu"),
                student("Neha Singh", "neha.singh@university.edu"),
                student("Aditya Menon", "aditya.menon@university.edu"),
                student("Sara Thomas", "sara.thomas@university.edu"),
                student("Kabir Khan", "kabir.khan@university.edu"),
                student("Diya Patel", "diya.patel@university.edu"),
                student("Nolan Brooks", "nolan.brooks@university.edu"),
                student("Zara Ahmed", "zara.ahmed@university.edu"),
                student("Ethan Carter", "ethan.carter@university.edu"),
                student("Aisha Fernandes", "aisha.fernandes@university.edu"),
                student("Dev Malhotra", "dev.malhotra@university.edu"),
                student("Saanvi Nair", "saanvi.nair@university.edu"),
                student("Riya Das", "riya.das@university.edu"),
                student("Arjun Sen", "arjun.sen@university.edu"),
                student("Student User", "student@university.edu")
        );
        return studentRepository.saveAll(students);
    }

    private List<Course> seedCourses(List<Professor> professors, List<Student> students) {
        if (courseRepository.count() > 0) {
            return courses();
        }

        List<Course> courses = Arrays.asList(
                course("Introduction to Programming", 3, professors.get(0), students, 1, 2, 3, 16, 17, 36),
                course("Quantum Mechanics", 4, professors.get(1), students, 2, 4, 5, 18, 19),
                course("Calculus and Differential Equations", 4, professors.get(2), students, 1, 6, 7, 20, 21, 36),
                course("Organic Chemistry", 3, professors.get(3), students, 8, 9, 22, 23),
                course("Genetics and Cell Biology", 4, professors.get(4), students, 10, 11, 24, 25),
                course("Thermodynamics", 3, professors.get(5), students, 12, 13, 26, 27),
                course("Digital Electronics", 4, professors.get(6), students, 3, 5, 7, 28, 29),
                course("Structural Engineering", 3, professors.get(7), students, 14, 15, 30, 31),
                course("Machine Learning", 4, professors.get(8), students, 1, 4, 8, 16, 32, 36),
                course("Data Analytics", 3, professors.get(9), students, 2, 6, 10, 17, 33),
                course("Spring Boot API Development", 4, professors.get(0), students, 11, 12, 13, 18, 34, 36),
                course("Linear Algebra", 3, professors.get(2), students, 14, 15, 1, 19, 35),
                course("Database Management Systems", 4, professors.get(11), students, 16, 17, 18, 20, 22, 36),
                course("Cybersecurity Fundamentals", 3, professors.get(10), students, 19, 21, 23, 25, 27),
                course("Cloud Computing", 4, professors.get(11), students, 20, 22, 24, 26, 28),
                course("Robotics and Automation", 4, professors.get(14), students, 21, 23, 25, 29, 31),
                course("Business Intelligence", 3, professors.get(12), students, 24, 26, 28, 30, 32),
                course("Technical Communication", 2, professors.get(13), students, 1, 5, 9, 13, 17, 21, 36),
                course("Environmental Sustainability", 3, professors.get(15), students, 2, 6, 10, 14, 18, 22),
                course("Computer Networks", 4, professors.get(10), students, 3, 7, 11, 15, 19, 23, 36),
                course("Artificial Intelligence Ethics", 2, professors.get(8), students, 4, 8, 12, 16, 20, 24),
                course("Software Engineering Practices", 3, professors.get(0), students, 5, 9, 13, 17, 21, 25, 36),
                course("Probability and Statistics", 3, professors.get(9), students, 6, 10, 14, 18, 22, 26),
                course("IoT Systems Design", 4, professors.get(6), students, 7, 11, 15, 19, 23, 27, 36)
        );
        return courseRepository.saveAll(courses);
    }

    private List<Department> seedDepartments() {
        if (departmentRepository.count() > 0) {
            return departments();
        }

        return departmentRepository.saveAll(Arrays.asList(
                department("Computer Science", "CSE"),
                department("Data Science", "DS"),
                department("Mechanical Engineering", "ME"),
                department("Civil Engineering", "CE"),
                department("Electronics and Communication", "ECE"),
                department("Cybersecurity", "CYB"),
                department("Business Analytics", "BA"),
                department("Environmental Science", "ENV")
        ));
    }

    private List<Semester> seedSemesters(List<Department> departments) {
        if (semesterRepository.count() > 0) {
            return semesters();
        }

        return semesterRepository.saveAll(Arrays.asList(
                semester("CSE Semester 1", 1, departments.get(0)),
                semester("CSE Semester 2", 2, departments.get(0)),
                semester("CSE Semester 3", 3, departments.get(0)),
                semester("Data Science Semester 1", 1, departments.get(1)),
                semester("Data Science Semester 2", 2, departments.get(1)),
                semester("Mechanical Semester 1", 1, departments.get(2)),
                semester("Mechanical Semester 2", 2, departments.get(2)),
                semester("Civil Semester 1", 1, departments.get(3)),
                semester("Electronics Semester 2", 2, departments.get(4)),
                semester("Cybersecurity Semester 1", 1, departments.get(5)),
                semester("Business Analytics Semester 1", 1, departments.get(6)),
                semester("Environmental Science Semester 1", 1, departments.get(7))
        ));
    }

    private List<AcademicClass> seedClasses(List<Department> departments, List<Semester> semesters) {
        if (classRepository.count() > 0) {
            return classes();
        }

        return classRepository.saveAll(Arrays.asList(
                academicClass("B.Tech CSE", "A", departments.get(0), semesters.get(0)),
                academicClass("B.Tech CSE", "B", departments.get(0), semesters.get(1)),
                academicClass("B.Tech CSE", "C", departments.get(0), semesters.get(2)),
                academicClass("B.Sc Data Science", "A", departments.get(1), semesters.get(3)),
                academicClass("B.Sc Data Science", "B", departments.get(1), semesters.get(4)),
                academicClass("B.Tech Mechanical", "A", departments.get(2), semesters.get(5)),
                academicClass("B.Tech Mechanical", "B", departments.get(2), semesters.get(6)),
                academicClass("B.Tech Civil", "A", departments.get(3), semesters.get(7)),
                academicClass("B.Tech Electronics", "A", departments.get(4), semesters.get(8)),
                academicClass("B.Tech Cybersecurity", "A", departments.get(5), semesters.get(9)),
                academicClass("BBA Business Analytics", "A", departments.get(6), semesters.get(10)),
                academicClass("B.Sc Environmental Science", "A", departments.get(7), semesters.get(11))
        ));
    }

    private void seedSyllabi(List<Course> courses, List<Semester> semesters) {
        if (syllabusRepository.count() > 0) {
            return;
        }

        syllabusRepository.saveAll(Arrays.asList(
                syllabus("Programming Foundations", "Variables, control flow, arrays, functions, object basics, and problem solving labs.", courses.get(0), semesters.get(0)),
                syllabus("Calculus Core", "Limits, differentiation, integration, vector calculus, and engineering applications.", courses.get(2), semesters.get(0)),
                syllabus("Machine Learning Foundations", "Regression, classification, model evaluation, and supervised learning project work.", courses.get(8), semesters.get(3)),
                syllabus("Spring Boot APIs", "REST controllers, layered architecture, JPA persistence, validation, and API testing.", courses.get(10), semesters.get(1)),
                syllabus("Database Design", "ER modeling, normalization, SQL, indexing, transactions, and reporting queries.", courses.get(12), semesters.get(1)),
                syllabus("Cybersecurity Basics", "Security principles, threat models, network hardening, encryption, and incident response.", courses.get(13), semesters.get(9)),
                syllabus("Cloud Engineering", "Cloud service models, compute, storage, networking, deployment, and cost-aware architecture.", courses.get(14), semesters.get(2)),
                syllabus("Robotics Systems", "Sensors, actuators, control loops, automation workflows, and lab prototyping.", courses.get(15), semesters.get(6)),
                syllabus("Business Intelligence Lab", "Dashboards, KPI modeling, data storytelling, and decision-support workflows.", courses.get(16), semesters.get(10)),
                syllabus("Technical Communication", "Professional writing, presentations, meeting notes, reports, and interview communication.", courses.get(17), semesters.get(0)),
                syllabus("Sustainability Studies", "Climate systems, resource planning, waste management, and sustainability assessment.", courses.get(18), semesters.get(11)),
                syllabus("Networks Lab", "OSI/TCP-IP layers, routing, switching, DNS, HTTP, and packet inspection.", courses.get(19), semesters.get(2)),
                syllabus("AI Ethics", "Bias, fairness, explainability, privacy, and responsible AI governance.", courses.get(20), semesters.get(4)),
                syllabus("Software Engineering", "Requirements, design, version control, testing, CI, reviews, and agile delivery.", courses.get(21), semesters.get(2)),
                syllabus("Statistics for Data Science", "Probability, distributions, hypothesis testing, regression, and data interpretation.", courses.get(22), semesters.get(3)),
                syllabus("IoT Engineering", "Embedded controllers, sensors, protocols, cloud telemetry, and IoT security.", courses.get(23), semesters.get(8))
        ));
    }

    private void seedFees(List<Student> students) {
        if (feeRepository.count() > 0) {
            return;
        }

        List<Fee> fees = Arrays.asList(
                fee(students.get(0), "45000.00", FeeStatus.PAID, "2026-06-10", "2026-05-02"),
                fee(students.get(1), "45000.00", FeeStatus.PENDING, "2026-06-10", null),
                fee(students.get(2), "42000.00", FeeStatus.OVERDUE, "2026-04-15", null),
                fee(students.get(3), "47000.00", FeeStatus.PAID, "2026-06-10", "2026-05-04"),
                fee(students.get(4), "45000.00", FeeStatus.PENDING, "2026-06-10", null),
                fee(students.get(5), "44000.00", FeeStatus.PAID, "2026-06-10", "2026-04-28"),
                fee(students.get(6), "46000.00", FeeStatus.PENDING, "2026-06-15", null),
                fee(students.get(7), "43000.00", FeeStatus.OVERDUE, "2026-04-20", null),
                fee(students.get(8), "45500.00", FeeStatus.PAID, "2026-06-12", "2026-05-01"),
                fee(students.get(9), "46500.00", FeeStatus.PENDING, "2026-06-18", null),
                fee(students.get(10), "47000.00", FeeStatus.PAID, "2026-06-18", "2026-05-05"),
                fee(students.get(11), "43500.00", FeeStatus.PENDING, "2026-06-20", null),
                fee(students.get(12), "44000.00", FeeStatus.OVERDUE, "2026-04-25", null),
                fee(students.get(13), "45500.00", FeeStatus.PAID, "2026-06-21", "2026-05-03"),
                fee(students.get(14), "46000.00", FeeStatus.PENDING, "2026-06-22", null),
                fee(students.get(15), "52000.00", FeeStatus.PAID, "2026-06-10", "2026-05-06"),
                fee(students.get(16), "52000.00", FeeStatus.PENDING, "2026-06-10", null),
                fee(students.get(17), "51000.00", FeeStatus.PAID, "2026-06-10", "2026-05-04"),
                fee(students.get(18), "50000.00", FeeStatus.OVERDUE, "2026-04-18", null),
                fee(students.get(19), "51500.00", FeeStatus.PENDING, "2026-06-14", null),
                fee(students.get(20), "50500.00", FeeStatus.PAID, "2026-06-14", "2026-05-05"),
                fee(students.get(21), "49500.00", FeeStatus.PENDING, "2026-06-16", null),
                fee(students.get(22), "50000.00", FeeStatus.OVERDUE, "2026-04-28", null),
                fee(students.get(23), "52500.00", FeeStatus.PAID, "2026-06-16", "2026-05-02"),
                fee(students.get(24), "49000.00", FeeStatus.PENDING, "2026-06-20", null),
                fee(students.get(25), "50000.00", FeeStatus.PAID, "2026-06-20", "2026-05-01"),
                fee(students.get(26), "50500.00", FeeStatus.PENDING, "2026-06-22", null),
                fee(students.get(27), "51500.00", FeeStatus.PAID, "2026-06-22", "2026-05-06"),
                fee(students.get(28), "49500.00", FeeStatus.PENDING, "2026-06-24", null),
                fee(students.get(29), "48000.00", FeeStatus.OVERDUE, "2026-04-30", null),
                fee(students.get(30), "50000.00", FeeStatus.PAID, "2026-06-24", "2026-05-04"),
                fee(students.get(31), "52000.00", FeeStatus.PENDING, "2026-06-26", null),
                fee(students.get(32), "51000.00", FeeStatus.PAID, "2026-06-26", "2026-05-06"),
                fee(students.get(33), "49500.00", FeeStatus.PENDING, "2026-06-28", null),
                fee(students.get(34), "50500.00", FeeStatus.OVERDUE, "2026-04-26", null),
                fee(students.get(35), "45000.00", FeeStatus.PENDING, "2026-06-30", null)
        );
        feeRepository.saveAll(fees);
    }

    private void seedMarks(List<Student> students, List<Course> courses, List<Semester> semesters) {
        if (markRepository.count() > 0) {
            return;
        }

        int[][] markRows = {
                {1, 1, 1, 92}, {2, 1, 1, 78}, {3, 7, 9, 38}, {4, 9, 4, 84},
                {5, 2, 1, 67}, {6, 3, 1, 88}, {7, 3, 1, 73}, {8, 9, 4, 91},
                {9, 18, 1, 64}, {10, 23, 4, 59}, {11, 11, 2, 82}, {12, 11, 2, 76},
                {13, 22, 3, 35}, {14, 8, 8, 70}, {15, 24, 9, 86}, {16, 13, 2, 94},
                {17, 13, 2, 81}, {18, 15, 3, 69}, {19, 14, 10, 41}, {20, 15, 3, 77},
                {21, 16, 7, 89}, {22, 17, 11, 72}, {23, 20, 3, 57}, {24, 17, 11, 83},
                {25, 16, 7, 62}, {26, 23, 4, 80}, {27, 24, 9, 44}, {28, 15, 3, 93},
                {29, 16, 7, 52}, {30, 17, 11, 36}, {31, 16, 7, 74}, {32, 9, 4, 87},
                {33, 10, 4, 90}, {34, 11, 2, 66}, {35, 12, 1, 79}, {36, 1, 1, 85},
                {36, 3, 1, 68}, {36, 9, 4, 91}, {36, 11, 2, 73}, {36, 13, 2, 88},
                {36, 20, 3, 64}, {36, 22, 3, 82}, {36, 24, 9, 76}
        };

        List<MarkRecord> marks = Arrays.stream(markRows)
                .map(row -> mark(students.get(row[0] - 1), courses.get(row[1] - 1), semesters.get(row[2] - 1), row[3]))
                .toList();
        markRepository.saveAll(marks);
    }

    private void seedTimetable(List<Course> courses, List<Professor> professors, List<AcademicClass> classes) {
        if (timetableRepository.count() > 0) {
            return;
        }

        timetableRepository.saveAll(Arrays.asList(
                timetable("Monday", "09:00", "10:00", "CSE Lab 1", courses.get(0), professors.get(0), classes.get(0)),
                timetable("Monday", "10:15", "11:15", "Room 204", courses.get(2), professors.get(2), classes.get(0)),
                timetable("Monday", "11:30", "12:30", "Data Studio", courses.get(12), professors.get(11), classes.get(1)),
                timetable("Monday", "14:00", "15:00", "Cloud Lab", courses.get(14), professors.get(11), classes.get(2)),
                timetable("Tuesday", "09:00", "10:00", "Physics Hall", courses.get(1), professors.get(1), classes.get(0)),
                timetable("Tuesday", "10:15", "11:15", "AI Studio", courses.get(8), professors.get(8), classes.get(3)),
                timetable("Tuesday", "11:30", "12:30", "Network Lab", courses.get(19), professors.get(10), classes.get(2)),
                timetable("Tuesday", "14:00", "15:00", "Business Lab", courses.get(16), professors.get(12), classes.get(10)),
                timetable("Wednesday", "09:00", "10:00", "CSE Lab 2", courses.get(10), professors.get(0), classes.get(1)),
                timetable("Wednesday", "10:15", "11:15", "Robotics Lab", courses.get(15), professors.get(14), classes.get(6)),
                timetable("Wednesday", "11:30", "12:30", "Communication Hall", courses.get(17), professors.get(13), classes.get(0)),
                timetable("Wednesday", "14:00", "15:00", "Civil Studio", courses.get(7), professors.get(7), classes.get(7)),
                timetable("Thursday", "09:00", "10:00", "Mechanical Hall", courses.get(5), professors.get(5), classes.get(5)),
                timetable("Thursday", "10:15", "11:15", "Cyber Range", courses.get(13), professors.get(10), classes.get(9)),
                timetable("Thursday", "11:30", "12:30", "Electronics Lab", courses.get(6), professors.get(6), classes.get(8)),
                timetable("Thursday", "14:00", "15:00", "IoT Lab", courses.get(23), professors.get(6), classes.get(8)),
                timetable("Friday", "09:00", "10:00", "Biology Lab", courses.get(4), professors.get(4), classes.get(11)),
                timetable("Friday", "10:15", "11:15", "Analytics Lab", courses.get(9), professors.get(9), classes.get(3)),
                timetable("Friday", "11:30", "12:30", "Seminar Hall", courses.get(20), professors.get(8), classes.get(4)),
                timetable("Friday", "14:00", "15:00", "Sustainability Studio", courses.get(18), professors.get(15), classes.get(11))
        ));
    }

    private Professor professor(String name, String department) {
        Professor professor = new Professor();
        professor.setProfessorName(name);
        professor.setDepartment(department);
        return professor;
    }

    private Student student(String name, String email) {
        Student student = new Student();
        student.setStudentName(name);
        student.setEmail(email);
        return student;
    }

    private Course course(String name, int credits, Professor professor, List<Student> students, int... studentNumbers) {
        Course course = new Course();
        course.setCourseName(name);
        course.setCredits(credits);
        course.setProfessor(professor);
        course.setStudents(new java.util.ArrayList<>(Arrays.stream(studentNumbers)
                .mapToObj(number -> students.get(number - 1))
                .toList()));
        return course;
    }

    private Department department(String name, String code) {
        Department department = new Department();
        department.setDepartmentName(name);
        department.setCode(code);
        return department;
    }

    private Semester semester(String name, int number, Department department) {
        Semester semester = new Semester();
        semester.setSemesterName(name);
        semester.setSemesterNumber(number);
        semester.setDepartment(department);
        return semester;
    }

    private AcademicClass academicClass(String name, String section, Department department, Semester semester) {
        AcademicClass academicClass = new AcademicClass();
        academicClass.setClassName(name);
        academicClass.setSection(section);
        academicClass.setDepartment(department);
        academicClass.setSemester(semester);
        return academicClass;
    }

    private Syllabus syllabus(String title, String description, Course course, Semester semester) {
        Syllabus syllabus = new Syllabus();
        syllabus.setTitle(title);
        syllabus.setDescription(description);
        syllabus.setCourse(course);
        syllabus.setSemester(semester);
        return syllabus;
    }

    private Fee fee(Student student, String amount, FeeStatus status, String dueDate, String paymentDate) {
        Fee fee = new Fee();
        fee.setStudent(student);
        fee.setAmount(new BigDecimal(amount));
        fee.setStatus(status);
        fee.setDueDate(LocalDate.parse(dueDate));
        if (paymentDate != null) {
            fee.setPaymentDate(LocalDate.parse(paymentDate));
        }
        return fee;
    }

    private MarkRecord mark(Student student, Course course, Semester semester, int marks) {
        MarkRecord record = new MarkRecord();
        record.setStudent(student);
        record.setCourse(course);
        record.setSemester(semester);
        record.setMarks(BigDecimal.valueOf(marks));
        return record;
    }

    private TimetableEntry timetable(
            String day,
            String start,
            String end,
            String room,
            Course course,
            Professor professor,
            AcademicClass academicClass) {
        TimetableEntry entry = new TimetableEntry();
        entry.setDayOfWeek(day);
        entry.setStartTime(start);
        entry.setEndTime(end);
        entry.setRoom(room);
        entry.setCourse(course);
        entry.setProfessor(professor);
        entry.setAcademicClass(academicClass);
        return entry;
    }

    private List<Professor> professors() {
        return professorRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Professor::getProfessorId))
                .toList();
    }

    private List<Student> students() {
        return studentRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Student::getStudentId))
                .toList();
    }

    private List<Course> courses() {
        return courseRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Course::getCourseId))
                .toList();
    }

    private List<Department> departments() {
        return departmentRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Department::getDepartmentId))
                .toList();
    }

    private List<Semester> semesters() {
        return semesterRepository.findAll().stream()
                .sorted(Comparator.comparingInt(Semester::getSemesterId))
                .toList();
    }

    private List<AcademicClass> classes() {
        return classRepository.findAll().stream()
                .sorted(Comparator.comparingInt(AcademicClass::getClassId))
                .toList();
    }
}
