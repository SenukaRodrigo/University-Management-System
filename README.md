# University Management System

A full-stack web application where users register as **students** or **lecturers**.
Lecturers create lectures, students request to join them, and lecturers accept or
reject those requests. Built with a Java Spring Boot backend, a React frontend, and a
PostgreSQL database, secured with JWT authentication.

---

## Features

- Sign up and log in as a student or a lecturer (JWT authentication)
- Passwords hashed with BCrypt — never stored or returned in plain text
- Role-based access control (students vs lecturers) and ownership rules
- Lecturers create, edit, and delete their own lectures
- Students browse lectures and request to join them
- Lecturers view incoming requests and accept or reject them
- Request status tracking: **Pending → Accepted / Rejected**

---

## Tech Stack

| Layer      | Technology                                          |
| ---------- | --------------------------------------------------- |
| Backend    | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Auth       | JWT (jjwt)                                           |
| Database   | PostgreSQL                                           |
| Frontend   | React (Vite), React Router, Axios                    |

---

## Prerequisites

Make sure these are installed before you start:

- **Java 21** (JDK)
- **Node.js** (LTS) and npm
- **PostgreSQL**
- Maven is optional — the project includes the Maven wrapper (`mvnw`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SenukaRodrigo/University-Management-System.git
cd University-Management-System
```

> Replace the URL above with your actual repository link.

### 2. Create the database

Open PostgreSQL and create an empty database:

```bash
psql -U postgres
CREATE DATABASE lecturesystem;
\q
```

### 3. Set the environment variables

The backend reads two secrets from environment variables instead of from the code,
so they never end up in the repository. Set both before running the app:

| Variable      | Description                                              |
| ------------- | ------------------------------------------------------- |
| `DB_PASSWORD` | Your PostgreSQL `postgres` user password                |
| `JWT_SECRET`  | A long random string used to sign tokens (32+ characters) |

**Windows (PowerShell):**

```powershell
setx DB_PASSWORD "your_postgres_password"
setx JWT_SECRET "your_long_random_secret"
```

Then **restart your terminal / IDE** so the variables load.

**macOS / Linux:**

```bash
export DB_PASSWORD="your_postgres_password"
export JWT_SECRET="your_long_random_secret"
```

(Add those lines to your `~/.bashrc` or `~/.zshrc` to make them permanent.)

> **Generating a strong `JWT_SECRET`:**
> macOS / Linux — `openssl rand -base64 48`
> Windows (PowerShell):
> ```powershell
> $bytes = [byte[]]::new(48)
> [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
> [Convert]::ToBase64String($bytes)
> ```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on **http://localhost:8080**. On the first run it creates the database
tables automatically.

### 5. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** — open that in your browser.

---

## Project Structure

```
University-Management-System/
├── backend/     # Spring Boot REST API
├── frontend/    # React application
└── README.md
```

---

## API Overview

| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| POST   | `/api/auth/signup`              | Register (public)               |
| POST   | `/api/auth/login`               | Log in, returns a JWT (public)  |
| GET    | `/api/lectures`                 | Browse all lectures             |
| POST   | `/api/lectures`                 | Create a lecture (lecturer)     |
| PUT    | `/api/lectures/{id}`            | Edit a lecture (owner)          |
| DELETE | `/api/lectures/{id}`            | Delete a lecture (owner)        |
| POST   | `/api/lectures/{id}/requests`   | Request to join (student)       |
| GET    | `/api/requests/mine`            | A student's own requests        |
| PUT    | `/api/requests/{id}`            | Accept / reject (owning lecturer) |

All endpoints except signup and login require an `Authorization: Bearer <token>` header.

---

## Usage

1. Sign up as a **lecturer** and create a lecture.
2. Sign up as a **student**, browse the lectures, and request to join one.
3. Log back in as the lecturer to accept or reject the request.
4. As the student, see the request status update.

---

## Notes

- The backend must be running for the frontend to work.
- CORS is configured to allow the frontend at `http://localhost:5173`.
