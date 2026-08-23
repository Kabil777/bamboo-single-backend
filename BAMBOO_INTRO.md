# Bamboo Platform - Project Overview & Introduction

Welcome to **Bamboo**, a modern, full-stack content publishing and community platform built with TypeScript, Node.js/Express, Next.js, and PostgreSQL.

---

## 🚀 Overview

Bamboo provides a complete solution for content creation, reading platforms, community interactions, and document management. It features a scalable Express backend REST API and a Next.js web application interface with rich text editing and media capabilities.

---

## 🛠️ Architecture & Tech Stack

### Backend Stack
- **Runtime**: Node.js (ES Modules, TypeScript)
- **Web Framework**: Express.js 5
- **Database & ORM**: PostgreSQL via Prisma 7 ORM (`@prisma/client`)
- **Authentication**: Passport.js with JWT Access & Refresh tokens, Google OAuth 2.0
- **Logging**: Pino structured JSON logger with custom request, middleware, and response tracking
- **API Documentation**: OpenAPI 3.0 via `swagger-ui-express` & `swagger-jsdoc`

### Frontend Stack
- **Framework**: Next.js / React
- **State Management**: Redux Toolkit & Redux Hooks
- **Editor**: TipTap Rich Text Editor
- **Styling**: Tailwind CSS & Shadcn UI components

---

## 📂 Core Functional Modules

Bamboo is organized into domain-specific modules:

1. **Authentication (`/api/v1/auth`)**
   - JWT-based authentication (Bearer tokens & `ac_token` httpOnly cookies).
   - OAuth 2.0 integration (Google Login).
   - Public JSON Web Key Set (`/.well-known/jwks.json`) for decentralized token verification.

2. **Posts & Articles (`/api/v1/posts`)**
   - Blog post drafting, publication, liking, bookmarking, and category tagging.

3. **Media Management (`/api/v1/media`)**
   - Upload and storage management for images, covers, and media assets.

4. **Community (`/api/v1/community`)**
   - Discussion forums, comments, user interactions, and user profile management.

5. **Document Platform (`/api/v1/docs`)**
   - Multi-page document generation, pagination, and document management.

6. **Newsletters (`/api/v1/newsletters`)**
   - Newsletter subscription management and broadcast scheduling.

7. **Link Previews (`/api/v1/link-previews`)**
   - Dynamic open-graph metadata fetching for embedded external links.

8. **Reading Platforms & Tags (`/api/v1/reading-platforms`, `/api/v1/tags`)**
   - Cross-platform metadata aggregation and tag classification.

---

## 📝 Request, Middleware & Logging Lifecycle

Every incoming HTTP request passes through a structured middleware chain with detailed log traces:

```
Incoming Request (req)
   │
   ├──► [REQ] RequestLogger (Generates unique Request ID & records method/URL/query/IP)
   │
   ├──► [MIDDLEWARE] CorsMiddleware
   ├──► [MIDDLEWARE] JsonBodyParserMiddleware
   ├──► [MIDDLEWARE] CookieParserMiddleware
   ├──► [MIDDLEWARE] PassportInitMiddleware
   │
   ├──► [SWAGGER] /api/v1/swagger (Swagger UI Documentation)
   │
   ├──► Route Handler Execution (authRequired / adminRequired / Controllers)
   │
   └──► [RES] Response Logger (Logs HTTP status code and response duration in ms)
```

---

## 📖 Interactive API Documentation (Swagger)

Bamboo includes interactive OpenAPI / Swagger UI documentation built-in.

- **Swagger UI Interactive Docs**: `http://localhost:5000/api/v1/swagger`
- **OpenAPI JSON Specification**: `http://localhost:5000/api/v1/swagger.json`

### Key Features of Swagger Integration:
- Full interactive testing for all backend endpoints.
- Pre-configured Security Schemes (Bearer JWT & Cookie Authentication).
- Integrated logger emitting request and response traces when interacting via Swagger UI.

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database instance

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in `backend/`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bamboo_db?schema=public"
   PORT=5000
   JWT_SECRET="your-jwt-secret"
   LOG_LEVEL="info"
   ```

4. Run Database Migrations:
   ```bash
   npx prisma db push
   ```

5. Start the Development Server:
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000` with Swagger UI enabled at `http://localhost:5000/api/v1/swagger`.

### Type Checking & Building
```bash
npm run typecheck   # Run TypeScript compiler checks
npm run build       # Build production bundle in dist/
npm start           # Run built production server
```

---

## 📜 License & Contribution

This project is licensed under the ISC License. Contributions and feedback are welcome!
