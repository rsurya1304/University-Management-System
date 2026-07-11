# University Management System - Project Guide

## Overview

This project has two applications:

| Part | Folder | Technology | Local URL |
| --- | --- | --- | --- |
| Frontend | `frontend` | React class components | `http://localhost:3000` |
| Backend | `university` | Spring Boot REST API | `http://localhost:8080` |

The backend handles login, JWT authentication, role-based authorization, seeded demo data, and CRUD APIs for students, professors, courses, fees, marks, timetable, reports, announcements, and academic records.

## Local Startup

Start backend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\university"
.\mvnw.cmd spring-boot:run
```

Start frontend:

```powershell
cd "C:\Users\rasap\Music\OneDrive\Desktop\univerity management systsem\frontend"
npm start
```

Open `http://localhost:3000`.

## Production App

Use only this production frontend link:

```text
https://university-management-system-topaz.vercel.app/login
```

## Demo Users

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@university.com` | `admin123` |
| Professor | `professor@university.com` | `professor123` |
| Seeded Professor | `john.smith@university.edu` | `professor123` |
| Student | `student@university.com` | `student123` |
| Seeded Student | `alice.johnson@university.edu` | `student123` |

Every seeded student can log in with their own email and `student123`. Every seeded professor can log in with their own email and `professor123`. Students can self-register from the public registration screen. Staff accounts are created by admins from the Access page.

## Authentication Flow

```text
Login form
  -> POST /auth/login
  -> backend validates bcrypt password
  -> backend returns JWT
  -> frontend stores session in localStorage
  -> api.js sends Authorization: Bearer <token>
  -> AuthInterceptor enforces role rules on every protected API
```

## Database

The project uses H2 locally and MySQL in production.

Runtime database:

```properties
spring.datasource.url=jdbc:h2:file:./data/university-db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

Test database:

```properties
spring.datasource.url=jdbc:h2:mem:university-test;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

Production database:

```env
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-aiven-host
DB_PORT=14566
DB_NAME=defaultdb
DB_USERNAME=avnadmin
DB_PASSWORD=your-secret-password
```

Production secrets must be stored in Render environment variables, not in GitHub.

## Data Seeding

Demo users and university records are created in:

```text
university/src/main/java/com/example/university/config/DemoDataInitializer.java
```

Seeded student accounts are connected to matching student profiles, fees, courses, and marks by email. Seeded professor accounts are connected through professor email records.

## Roles

Admin:
Full platform access, including account creation, CRUD operations, reports, and all academic/financial modules.

Professor:
Can view lookup data and manage marks/timetable entries.

Student:
Can view own profile, fees, marks, courses, timetable, and allowed read-only data.

## Important Backend Files

| File | Purpose |
| --- | --- |
| `AuthController.java` | Login, student registration, staff creation |
| `AuthService.java` | Validation, password hashing, account creation |
| `JwtService.java` | JWT creation and verification |
| `AuthInterceptor.java` | Role-based API authorization |
| `MeController.java` | Student self-service APIs |
| `AnnouncementController.java` | University notices CRUD |
| `DemoDataInitializer.java` | Seeded demo data |
| `application.properties` | Local H2, server, JWT, CORS configuration |
| `application-prod.properties` | Production MySQL/Aiven configuration |

## Important Frontend Files

| File | Purpose |
| --- | --- |
| `AuthShell` | Login/register UI and demo credentials |
| `AccessPage` | Role details and admin staff registration |
| `DashboardLayout` | Navigation and signed-in shell |
| `AnnouncementsPage` | Notices module for admin management and role read access |
| `ProtectedRoute` | Frontend route authorization |
| `ModulePage` | Reusable CRUD/read-only module |
| `config/access.js` | Role permissions and demo accounts |
| `services/api.js` | API wrapper and session-expiry handling |

## Verification Commands

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

## Production Deployment Notes

For a fresh deployment:

- Deploy the backend from `university`.
- Deploy the frontend from `frontend`.
- Set frontend `REACT_APP_API_URL` to the latest backend URL.
- Set backend `FRONTEND_URL` or `app.cors.allowed-origins` to `https://university-management-system-topaz.vercel.app`.
- Set backend `JWT_SECRET` to a strong secret.
- Set backend `SPRING_PROFILES_ACTIVE=prod`.
- Set backend `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and `DB_PASSWORD` from Aiven.
- Delete obsolete cloud deployments directly in the provider dashboard or with authenticated provider API tokens.

Keep only this working production frontend link in project documentation.
