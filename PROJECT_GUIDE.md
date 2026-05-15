# University Management System - Full Project Guide

This guide explains how the project works from beginner level to deployment level.

## 1. What This Project Is

This is a full-stack university management system.

It has two applications:

| Part | Folder | Technology | Runs On |
| --- | --- | --- | --- |
| Frontend | `frontend` | React class components | `http://localhost:3000` |
| Backend | `university` | Spring Boot REST API | `http://localhost:8080` |

The frontend is what users see in the browser.

The backend handles:

- Login and registration
- JWT authentication
- Access-level restrictions
- Database records
- Students, professors, courses, fees, marks, timetable, reports

The database is H2, so no Docker, MySQL username, or MySQL password is required for local demo use.

## 2. How To Run Locally

Start backend first:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\university"
.\mvnw.cmd spring-boot:run
```

Start frontend second:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\frontend"
npm start
```

Open:

```text
http://localhost:3000
```

Backend API:

```text
http://localhost:8080
```

## 3. Login Credentials

These demo users are created automatically by the backend:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@university.edu` | `admin123` |
| Registrar | `registrar@university.edu` | `registrar123` |
| Professor | `professor@university.edu` | `professor123` |
| Student | `student@university.edu` | `student123` |

The login page does not display passwords in production. Use the demo credentials from this guide while testing, or enable demo buttons only in a private build with `REACT_APP_SHOW_DEMO_ACCOUNTS=true`.

Recommended real-world behavior:

- Do not display real passwords in the application UI.
- Users should remember their own password.
- Admin should create staff accounts.
- Students can self-register.
- Password reset should be a separate secure feature in a real production app.

## 4. How Passwords Work

Passwords are not saved as plain text.

The backend flow is:

```text
User enters password
Backend hashes password using bcrypt
Only bcrypt hash is stored in user_account.password_hash
```

During login:

```text
User enters password
Backend compares password against stored bcrypt hash
If correct, backend returns a JWT token
Frontend stores JWT token in localStorage
Future API calls send Authorization: Bearer <token>
```

Important files:

| File | Purpose |
| --- | --- |
| `AuthService.java` | Hashes passwords and validates login |
| `JwtService.java` | Creates and verifies JWT tokens |
| `AuthInterceptor.java` | Blocks requests if token or role is invalid |
| `api.js` | Adds JWT token to frontend API calls |

## 5. Login And Register Flow

Login:

```text
React AuthShell
POST /auth/login
Backend validates email/password
Backend returns user details + JWT token
Frontend saves session in localStorage
React Router redirects to the first allowed workspace route for that accessLevel
```

Register:

```text
React AuthShell
POST /auth/register
Backend allows STUDENT registration only
Backend creates UserAccount
Backend creates matching Student row using same email
Frontend logs student in automatically
```

Staff accounts:

```text
POST /auth/staff
Admin creates Registrar or Professor accounts
Students should not use this endpoint
```

The login account connects to student data by email:

```text
user_account.email = student.email
```

That is why `student@university.edu` can see personal fees and marks.

## 6. Access Levels

Admin:

- Full system access
- Manage all students, professors, courses, academics, fees, marks, timetable, reports, and accounts

Registrar:

- Manage academic operations
- Manage students, courses, departments, semesters, classes, syllabus, fees, and reports
- Cannot manage professor accounts

Professor:

- View students, professors, courses, departments, semesters, classes, syllabus, reports
- Manage marks and timetable
- Cannot manage fees or user accounts

Student:

- View courses, timetable, syllabus
- View own fees
- View own marks/results
- Cannot edit master data

Frontend role definitions live in:

```text
frontend/src/config/access.js
```

Backend role enforcement lives in:

```text
university/src/main/java/com/example/university/security/AuthInterceptor.java
```

The backend restriction is the important one. Frontend hiding is good for UI, but backend enforcement is what protects data.

## 7. Frontend Component Structure

All components are inside:

```text
frontend/src/components
```

Each component has:

```text
index.js
index.css
```

Important components:

| Component | Purpose |
| --- | --- |
| `App` | Class-based BrowserRouter, Switch, Route, Redirect, and session state |
| `AuthShell` | Login/register UI and show/hide password |
| `ProtectedRoute` | Blocks unauthenticated users and redirects unauthorized access levels |
| `DashboardLayout` | Main shell after login: sidebar, mobile nav, topbar, theme toggle |
| `OverviewPage` | Loads overview counts and course summary |
| `StudentsPage` | Student table, search, add, update, delete |
| `ProfessorsPage` | Professor table, search, add, update, delete |
| `CoursesPage` | Course table, search, add, update, delete |
| `AcademicPage` | Departments, semesters, classes, and syllabus modules |
| `FeesPage` | Fee records or student self-service fees |
| `MarksPage` | Marks/results or student self-service marks |
| `TimetablePage` | Timetable module |
| `ReportsPage` | Admin/report summary |
| `AccessPage` | Current role and permission explanation |
| `Overview` | Metrics and current access summary |
| `ModulePage` | Reusable table + form module for fees, marks, timetable, reports, academic pages |
| `StudentTable` | Student table UI |
| `StudentForm` | Add/update student form |
| `ProfessorTable` | Professor table UI |
| `ProfessorForm` | Add/update professor form |
| `CourseTable` | Course table UI |
| `CourseForm` | Add/update course form |
| `AccessPanel` | Explains current role and permissions |
| `AccessPreview` | Login-side role explanation |
| `ThemeProvider` | React Context for light/dark theme |
| `ThemeToggle` | Theme switch button |
| `UserCard` | Signed-in user card and sign out |

The project uses React class components and React Router DOM v5. It does not use React hooks.

## 8. Frontend API Layer

API file:

```text
frontend/src/services/api.js
```

This file:

- Stores backend base URL
- Reads token from localStorage
- Adds `Authorization` header
- Converts JS objects into JSON request body
- Handles API errors

Default API URL:

```text
http://localhost:8080
```

For deployed frontend, set:

```text
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 9. Backend Structure

Backend root:

```text
university/src/main/java/com/example/university
```

Important folders:

| Folder | Purpose |
| --- | --- |
| `controller` | REST API endpoints |
| `model` | JPA database entities |
| `repository` | Database access interfaces |
| `service` | Business logic |
| `security` | JWT and access-level checks |
| `config` | CORS, interceptors, demo users |
| `dto` | Request/response objects |

## 10. Backend API Controllers

| Controller | Main endpoints |
| --- | --- |
| `AuthController` | `/auth/login`, `/auth/register`, `/auth/staff`, `/auth/access-levels` |
| `StudentController` | `/students`, `/students/count` |
| `ProfessorController` | `/professors`, `/professors/count` |
| `CourseController` | `/courses`, `/courses/count` |
| `AcademicController` | `/departments`, `/semesters`, `/classes`, `/syllabi` |
| `FinanceController` | `/fees` |
| `ResultController` | `/marks` |
| `TimetableController` | `/timetables` |
| `ReportController` | `/reports/summary` |
| `MeController` | `/me/student`, `/me/fees`, `/me/marks` |

## 11. Database Tables

Tables are created from JPA entity classes.

Seed data is inserted from Java startup code:

```text
university/src/main/java/com/example/university/config/DemoDataInitializer.java
```

Main tables:

| Table | Meaning |
| --- | --- |
| `user_account` | Login accounts and access levels |
| `student` | Student profile records |
| `professor` | Professor profile records |
| `course` | Course catalog |
| `course_student` | Student-course enrollment relation |
| `department` | University departments |
| `semester` | Semesters per department |
| `academic_class` | Classes/sections |
| `syllabus` | Syllabus by course and semester |
| `fee` | Fee amount/status/due/payment date |
| `mark_record` | Marks, percentage, grade, pass/fail |
| `timetable_entry` | Scheduled class entries |

Current seed data:

| Data | Count |
| --- | --- |
| Students | 36 |
| Professors | 16 |
| Courses | 24 |
| Departments | 8 |
| Semesters | 12 |
| Academic classes | 12 |
| Syllabus records | 16 |
| Fee records | 36 |
| Mark records | 43 |
| Timetable entries | 20 |

## 12. Marks Logic

Marks are stored out of 100.

Backend calculates:

- Percentage
- Grade
- PASS/FAIL

Pass mark:

```text
40 and above = PASS
below 40 = FAIL
```

This logic lives in:

```text
MarkRecord.java
```

## 13. Student Data Logic

A student login can only see personal records through `/me` endpoints.

Example:

```text
student@university.edu logs in
Backend finds student row with same email
/me/fees returns only that student's fees
/me/marks returns only that student's marks
```

This is real-world style because students should not see all students' private fee/mark records.

## 14. Professor Data Logic

Professor can:

- Open Students
- Open Courses
- Open Marks
- Open Timetable
- Open Reports

Professor can manage:

- Marks
- Timetable

Professor can read lookup data needed by forms:

- Students
- Professors
- Courses
- Departments
- Semesters
- Classes
- Syllabus

This prevents `403` errors when professor opens Marks or Timetable forms.

## 15. Theme And Responsive Layout

Theme:

- Controlled by `ThemeProvider`
- Uses React Context
- Changes CSS variables on the HTML element
- Sidebar color changes with theme

Responsive design:

- Desktop: fixed sidebar, no hamburger/close sidebar icons
- Small devices: hamburger menu opens sidebar
- Tables scroll horizontally when needed
- Workspace scroll is controlled to avoid page breaking

## 16. How Add/Edit/Delete Works

For normal modules:

```text
Click Add -> form sends POST -> backend saves row -> table reloads
Click Edit -> form fills existing data -> sends PUT -> table reloads
Click Delete -> confirmation -> sends DELETE -> table reloads
```

The reusable frontend module for this is:

```text
ModulePage
```

Specific directory modules also use:

```text
StudentForm + StudentTable
ProfessorForm + ProfessorTable
CourseForm + CourseTable
```

## 17. Deployment Overview

Production needs two deployed services:

| Service | Type |
| --- | --- |
| Backend | Web Service |
| Frontend | Static Site |

Frontend must know backend URL:

```text
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Backend must allow frontend CORS URL.

For this demo deployment, Render starts the Spring Boot app with H2 in-memory data. The seeded data is recreated when the backend restarts.

## 18. Render Deployment Notes

Backend on Render:

- Use the Blueprint in `render.yaml`
- Service name: `university-management-system-api`
- Root directory: `university`
- Runtime: Docker
- Environment variables:

```text
JWT_SECRET=<Render generated value>
JWT_EXPIRATION_MINUTES=480
FRONTEND_URL=https://your-vercel-url.vercel.app
```

The backend binds to Render's port through:

```properties
server.port=${PORT:8080}
```

Frontend on Vercel:

- Import the same GitHub repository
- Root directory: `frontend`
- Environment variable:

```text
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

The Vercel rewrite for React Router lives in:

```text
frontend/vercel.json
```

## 19. Production Improvements Recommended Before Real Users

This project is good for learning/demo and can be evolved toward production.

Before real university deployment:

- Use a managed persistent database if real production data must survive restarts
- Move JWT secret to environment variable
- Add password reset
- Add email verification
- Add stronger validations
- Add audit logs for admin changes
- Add pagination/search server-side for very large tables
- Add role-specific professor assignment logic
- Add deployment CORS environment config
- Add automated API tests for every role

## 20. Simple Mental Model

Remember the project like this:

```text
React screen
  -> api.js sends request with JWT token
  -> Spring Controller receives request
  -> AuthInterceptor checks role permission
  -> Service/Repository reads or writes database
  -> JSON response returns to React
  -> React updates table/page
```

That is the whole system flow.
