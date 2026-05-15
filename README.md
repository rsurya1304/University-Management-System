# University Management System

Full-stack university operations application with a Spring Boot backend, H2 database, JWT authentication, bcrypt password hashing, and a React class-component frontend.

For the full beginner-friendly architecture, login/register, API, database, and deployment explanation, read:

```text
PROJECT_GUIDE.md
```

## Run The Project

Start the backend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\university"
.\mvnw.cmd spring-boot:run
```

Start the frontend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\frontend"
npm start
```

Open:

```text
http://localhost:3000
```

The frontend calls the backend at:

```text
http://localhost:8080
```

## Cloud Deployment

The source code is pushed to this GitHub repository:

```text
https://github.com/rsurya1304/University-Management-System
```

Recommended structure:

| Platform | Folder | Purpose |
| --- | --- | --- |
| Render | `university` | Spring Boot backend API |
| Vercel | `frontend` | React frontend |

Current Vercel production frontend:

```text
https://university-management-system-topaz.vercel.app
```

Expected Render backend URL:

```text
https://university-management-system-api.onrender.com
```

The backend Render Blueprint is already configured in `render.yaml`. To create the backend service, open:

```text
https://render.com/deploy?repo=https://github.com/rsurya1304/University-Management-System
```

Render will read `render.yaml`, build the Dockerized Spring Boot API from the `university` folder, and set `FRONTEND_URL` to the Vercel domain for CORS.

The Vercel project has this production environment variable:

```text
REACT_APP_API_URL=https://university-management-system-api.onrender.com
```

If Render gives a different backend URL, update `REACT_APP_API_URL` in Vercel Project Settings, then redeploy the frontend.

## Demo Login Accounts

These accounts are seeded automatically when the backend starts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@university.edu | admin123 |
| Registrar | registrar@university.edu | registrar123 |
| Professor | professor@university.edu | professor123 |
| Student | student@university.edu | student123 |

The login screen does not display demo passwords in production. Use the credentials above for testing, or set `REACT_APP_SHOW_DEMO_ACCOUNTS=true` only for a private demo build.

## Password Handling

Passwords are never stored as plain text in the database.

The backend uses bcrypt hashing:

```text
User password -> bcrypt hash -> stored in user_account.password_hash
```

During login:

```text
Entered password -> bcrypt compare -> JWT token returned if valid
```

The frontend stores the JWT session in browser localStorage so requests can include:

```text
Authorization: Bearer <token>
```

## Access Levels

Admin:
Full system control. Admin can manage users, students, professors, courses, departments, semesters, syllabus, fees, marks, timetable, and reports.

Registrar:
Academic operations role. Registrar can manage students, courses, departments, semesters, syllabus, fees, and reports, but cannot manage professor accounts.

Professor:
Teaching role. Professor can view students, courses, semesters, departments, professors, syllabus, and reports. Professor can manage marks and timetable entries. Professor cannot manage fees or user accounts.

Student:
Self-service role. Student can view courses, timetable, syllabus, own fees, and own marks/results. Student cannot edit academic master data.

## Architecture

Frontend:
React class components only. Components live in `frontend/src/components`, and each component has its own `index.js` and `index.css`.

Important frontend areas:

| Area | Purpose |
| --- | --- |
| `AuthShell` | Login, register, demo account selection, show/hide password |
| `App` | BrowserRouter, Switch, public routes, protected routes, session state |
| `ProtectedRoute` | Redirects unauthenticated users and blocks unauthorized access levels |
| `DashboardLayout` | Role-aware sidebar, mobile navigation, topbar, theme toggle |
| `StudentsPage`, `CoursesPage`, etc. | Page-specific API loading, forms, tables, and CRUD logic |
| `ModulePage` | Reusable CRUD/read-only table module |
| `ThemeProvider` | React Context theme state |
| `config/access.js` | Role labels, descriptions, nav permissions, demo users |
| `services/api.js` | API wrapper and JWT header handling |

Backend:
Spring Boot REST API with JPA repositories and an interceptor-based JWT access layer.

Important backend areas:

| Area | Purpose |
| --- | --- |
| `AuthController` | Login, student registration, staff creation |
| `AuthService` | bcrypt password hashing and account rules |
| `JwtService` | Token creation and verification |
| `AuthInterceptor` | Enforces role-based backend access |
| `MeController` | Student self-service data |
| `AcademicController` | Departments, semesters, classes, syllabus |
| `FinanceController` | Fee management |
| `ResultController` | Marks and result management |
| `TimetableController` | Timetable management |
| `ReportController` | Summary reports |

Database:
The project uses H2 only. No Docker and no MySQL setup is required.

Tables are created from JPA entities, and demo data is inserted from Java startup code:

```text
university/src/main/java/com/example/university/config/DemoDataInitializer.java
```

Because the database is H2 in-memory, demo data resets when the backend restarts. That is intentional for this learning/demo project.

Current seeded demo data:

| Data area | Count |
| --- | --- |
| Students | 36 |
| Professors | 16 |
| Courses | 24 |
| Departments | 8 |
| Semesters | 12 |
| Academic classes | 12 |
| Syllabus records | 16 |
| Fee records | 36 |
| Mark/result records | 43 |
| Timetable entries | 20 |

The seeded `student@university.edu` account is connected to a real student row, fee row, course enrollments, and multiple mark records, so the Student workspace has meaningful self-service data.

## API Summary

Authentication:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/register` | Student self-registration |
| POST | `/auth/staff` | Admin-created staff account |
| GET | `/auth/access-levels` | List access levels |

Main modules:

| Endpoint | Purpose |
| --- | --- |
| `/students` | Student records |
| `/professors` | Professor records |
| `/courses` | Course catalog |
| `/departments` | Departments |
| `/semesters` | Semesters |
| `/classes` | Academic classes |
| `/syllabi` | Syllabus records |
| `/fees` | Fee records |
| `/marks` | Marks and results |
| `/timetables` | Timetable entries |
| `/reports/summary` | Admin/report summary |
| `/me/fees` | Current student's fees |
| `/me/marks` | Current student's marks |
| `/me/student` | Current student's profile |

## Build And Verify

Backend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\university"
.\mvnw.cmd test
```

Frontend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\frontend"
npm run build
```
