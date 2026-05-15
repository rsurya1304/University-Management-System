# University Management System

Full-stack university operations application with a Spring Boot backend, H2 database, JWT authentication, bcrypt password hashing, and a React class-component frontend.

## Run Locally

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

Backend API:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

## Production App

Use only this production frontend link:

```text
https://university-management-system-topaz.vercel.app/login
```

## Demo Login Accounts

These accounts are seeded automatically when the backend starts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@university.com` | `admin123` |
| Professor | `professor@university.com` | `professor123` |
| Student | `student@university.com` | `student123` |

The login page displays these role-based demo credentials for local verification.

## Architecture

| Area | Stack |
| --- | --- |
| Frontend | React, React Router v5, class components |
| Backend | Spring Boot, Spring WebMVC, Spring Data JPA |
| Database | H2 only |
| Authentication | Custom JWT service, bcrypt password hashes, role interceptor |

The frontend calls the backend through `frontend/src/services/api.js`. For local development, `frontend/.env.development` points to `http://localhost:8080`.

## Database

The backend uses only H2:

```properties
spring.datasource.url=jdbc:h2:file:./data/university-db;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

Tests use an isolated in-memory H2 database from `university/src/test/resources/application.properties`, so local tests do not lock or modify the runtime database file.

Tables are created from JPA entities, and demo data is seeded from:

```text
university/src/main/java/com/example/university/config/DemoDataInitializer.java
```

## API Summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/register` | Student self-registration |
| POST | `/auth/staff` | Admin-created professor/admin account |
| GET | `/auth/access-levels` | List access levels |
| GET/POST/PUT/DELETE | `/students` | Student CRUD |
| GET/POST/PUT/DELETE | `/professors` | Professor CRUD |
| GET/POST/PUT/DELETE | `/courses` | Course CRUD |
| GET/POST/PUT/DELETE | `/fees` | Fee CRUD |
| GET/POST/PUT/DELETE | `/marks` | Marks CRUD |
| GET/POST/PUT/DELETE | `/timetables` | Timetable CRUD |
| GET | `/reports/summary` | Dashboard/report metrics |
| GET | `/me/student` | Current student profile |
| GET | `/me/fees` | Current student fees |
| GET | `/me/marks` | Current student marks |

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

## Production Deployment

Configure deployment platforms with environment variables:

| App | Variable | Value |
| --- | --- | --- |
| Frontend | `REACT_APP_API_URL` | Latest backend production URL |
| Backend | `FRONTEND_URL` or `app.cors.allowed-origins` | `https://university-management-system-topaz.vercel.app` |
| Backend | `JWT_SECRET` | Strong secret value |
| Backend | `JWT_EXPIRATION_MINUTES` | Token lifetime, for example `480` |

Remove obsolete deployment projects and URLs directly in the cloud provider dashboards or with provider API tokens. This repository keeps only the production frontend link above.
