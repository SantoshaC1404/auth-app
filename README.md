<div align="center">

# 🔐 Auth App

**A full-stack authentication system built with React 19 + Spring Boot 3**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)

</div>

---

## Overview

Auth App is a production-grade, full-stack authentication platform demonstrating industry-standard security patterns. It goes beyond basic login — implementing rotating refresh tokens, OTP-based password reset, social OAuth2 login, role-based access control, idle session timeout, account deletion, and a layered frontend architecture.

---

## Screenshots

> **Note:** Take screenshots of your running app and place them in a `screenshots/` folder, then update the paths below.

| Page | Light | Dark |
|------|-------|------|
| **Home** | `screenshots/home-light.png` | `screenshots/home-dark.png` |
| **Login** | `screenshots/login-light.png` | `screenshots/login-dark.png` |
| **Sign Up** | `screenshots/signup-light.png` | `screenshots/signup-dark.png` |
| **Dashboard** | `screenshots/dashboard-light.png` | `screenshots/dashboard-dark.png` |
| **Forgot Password** | `screenshots/forgot-light.png` | — |
| **Change Password** | `screenshots/change-password.png` | — |
| **Delete Account** | `screenshots/delete-account.png` | — |

---

## Features

### Authentication
- **JWT Access Tokens** — short-lived, stateless, verified on every request
- **Rotating Refresh Tokens** — stored in HttpOnly cookies, rotated on every use, revocable
- **OAuth2 Social Login** — Google and GitHub via Spring Security OAuth2 Client
- **OTP Password Reset** — 3-step flow: email → 6-digit OTP → new password
- **Session Validation** — app validates session via cookie on every page load
- **Idle Timeout** — auto-logout after 15 minutes of inactivity

### User Management
- Register with email/password
- Change password (requires current password, logs out on success)
- Delete account (removes all tokens and data, clears cookie)
- Welcome email on registration
- OTP email for forgot password

### Frontend
- **Route Guards** — `ProtectedRoute` (login required) and `PublicRoute` (redirect if logged in)
- **Dark / Light Theme** — system-aware toggle
- **Responsive** — mobile drawer sidebar on dashboard, mobile-optimised forms
- **Form Validation** — Zod schemas with React Hook Form, errors via toast
- **DM Sans + DM Mono** typography throughout

### Backend
- **Layered Architecture** — Controller → Service → Repository (zero business logic in controllers)
- **Spring Security Filter Chain** — stateless, JWT filter, OAuth2 client
- **Global Exception Handler** — consistent error responses
- **Multi-profile YAML** — `dev`, `qa`, `prod` profiles
- **Swagger / OpenAPI** — available at `/swagger-ui.html`

---

## Tech Stack

**Frontend** — React · TypeScript · Vite · Tailwind CSS · shadcn/ui · Zustand · React Router · Axios · Zod · Framer Motion

**Backend** — Spring Boot · Spring Security · Spring Data JPA · MySQL · JWT (JJWT) · OAuth2 · Spring Mail · Lombok · Swagger/OpenAPI

---

## Project Structure

```
auth-app/
├── auth-app-frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── api/           # Raw Axios API calls (one file per domain)
│   │   ├── components/
│   │   │   ├── dashboard/ # Sidebar, Header, StatsCards
│   │   │   └── ui/        # shadcn components
│   │   ├── hooks/         # useAuth — useLogin, useRegister, useLogout ...
│   │   ├── lib/           # Axios instances + silent refresh interceptor
│   │   ├── models/        # TypeScript interfaces matching backend DTOs
│   │   ├── pages/         # Route-level components
│   │   ├── services/      # Business logic between hooks and API layer
│   │   └── store/         # Zustand auth store
│   └── index.html
│
└── auth-app-backend/
    └── src/main/java/com/substring/auth_app_backend/
        ├── config/        # Security, CORS, ModelMapper, OpenAPI
        ├── controllers/   # Thin HTTP layer — delegates to services
        ├── dtos/          # Request / Response DTOs
        ├── entities/      # JPA entities
        ├── enums/         # Provider enum
        ├── exceptions/    # Global exception handler + custom exceptions
        ├── repositories/  # Spring Data JPA interfaces
        ├── security/      # JWT filter, cookie service, OAuth2 handler
        └── services/      # Business logic (interfaces + impls)
```

---

## Getting Started

### Prerequisites

- **Java** 21+
- **Node.js** 20+
- **MySQL** 8+
- **Maven** (or use the included `mvnw`)
- A **Gmail account** with an [App Password](https://myaccount.google.com/apppasswords)
- (Optional) Google & GitHub OAuth2 credentials

---

### Backend Setup

**1. Create the database**

```sql
CREATE DATABASE auth_app;
```

**2. Configure environment variables**

Create `.env` in `auth-app-backend/`:

```env
# Server
env.SERVER_PORT=8082

# Database
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Mail (Gmail App Password — not your real password)
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=abcdefghijklmnop

# JWT
JWT_SECRET=<base64-encoded-64-byte-string>
JWT_ISSUER=auth-app
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=604800
JWT_REFRESH_COOKIE_NAME=refresh_token
JWT_COOKIE_SECURE=false
JWT_HTTP_COOKIE_ONLY=true
JWT_COOKIE_SAME_SITE=lax
JWT_COOKIE_DOMAIN=localhost

# OAuth2 (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

> **Generate a JWT secret:**
> ```bash
> openssl rand -base64 64
> ```

**3. Run the backend**

```bash
cd auth-app-backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8082`  
Swagger UI: `http://localhost:8082/swagger-ui.html`

---

### Frontend Setup

**1. Configure environment**

Create `.env.development` in `auth-app-frontend/`:

```env
VITE_API_URL=http://localhost:8082/api/v1
VITE_API_BASE_URL=http://localhost:8082
```

**2. Install and run**

```bash
cd auth-app-frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## API Endpoints

### Auth — `/api/v1/auth` (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login — returns access token + sets refresh cookie |
| `POST` | `/refresh-token` | Rotate refresh token — returns new tokens |
| `POST` | `/logout` | Revoke refresh token + clear cookie |
| `POST` | `/forgot-password` | Send OTP to email |
| `POST` | `/verify-otp` | Verify OTP → returns resetToken |
| `POST` | `/reset-password` | Set new password using resetToken |

### Users — `/api/v1/users` (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/change-password` | Change authenticated user's password |
| `DELETE` | `/me` | Delete authenticated user's account |
| `GET` | `/` | Get all users |
| `GET` | `/email/{email}` | Get user by email |
| `GET` | `/userId/{userId}` | Get user by ID |
| `PUT` | `/{userId}` | Update user |
| `DELETE` | `/{userId}` | Delete user by ID |

### OAuth2

| Flow | URL |
|------|-----|
| Google Login | `http://localhost:8082/oauth2/authorization/google` |
| GitHub Login | `http://localhost:8082/oauth2/authorization/github` |

---

## Token Flow

```
Login
  │
  ├─► Validate credentials (Spring Security)
  ├─► Generate access token (JWT, 15 min)
  ├─► Generate refresh token (JWT, 7 days)
  ├─► Store refresh token record in DB
  ├─► Set refresh token as HttpOnly cookie
  └─► Return access token in response body

Protected Request
  │
  ├─► Attach Bearer access token (Axios interceptor)
  └─► On 401 → call /refresh-token → rotate token → retry

Logout
  └─► Revoke refresh token in DB → clear cookie → clear security context
```

---

## Forgot Password Flow

```
Step 1  →  POST /forgot-password  →  6-digit OTP emailed (valid 10 min)
Step 2  →  POST /verify-otp       →  returns short-lived resetToken (15 min)
Step 3  →  POST /reset-password   →  sets new password using resetToken
```

---

## Environment Profiles

The backend supports `dev`, `qa`, and `prod` profiles via Spring profiles:

```bash
# Run with a specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

Each profile has its own `application-{profile}.yaml` for database, JWT, and mail config.

---

## Security Highlights

- Passwords hashed with **BCrypt**
- Refresh tokens stored in **HttpOnly, SameSite cookies** — not accessible to JavaScript
- Rotating refresh tokens — each use invalidates the old token
- Token revocation on logout and account deletion
- User enumeration prevention on forgot-password endpoint
- Stateless session — no server-side HTTP sessions

---

<div align="center">

Built with React + Spring Boot

</div>
