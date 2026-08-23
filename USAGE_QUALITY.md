# Bamboo Platform - Usage Quality & Best Practices Guide

This document outlines the **Usage Quality, Reliability, and Operational Standards** for the Bamboo platform. It serves as a benchmark for developers, maintainers, and operators to ensure code quality, optimal performance, security, and seamless user experience.

---

## 🎯 Core Quality Principles

1. **Predictable & Consistent API Contracts**: All REST endpoints return standardized JSON structures with explicit HTTP status codes.
2. **End-to-End Request Tracing**: Every request is tagged with a unique `requestId` for correlated logging across middleware, controllers, and services.
3. **Fail-Fast & Graceful Degredation**: Inputs are validated early, errors are caught by centralized middleware, and fallbacks are provided to keep UI responsive.
4. **Zero Silent Errors**: Internal errors are captured in structured logs without masking root causes or exposing sensitive stack traces to clients.

---

## 🔒 1. Security & Authentication Quality

| Standard | Implementation | Quality Verification |
|---|---|---|
| **Token Handling** | Access tokens are stored in `httpOnly` secure cookies (`ac_token`) or passed via `Authorization: Bearer <token>` | Verified via `authMiddleware` |
| **Role-Based Access Control** | Explicit authorization guards (`adminRequired`, `authRequired`) on protected endpoints | Checked before database execution |
| **Payload Limits** | JSON request payload limited to 12MB (`express.json({ limit: "12mb" })`) | Prevents Memory DoS attacks |
| **Decentralized Auth** | OpenID/OAuth JWK public keys exposed at `/.well-known/jwks.json` | Validated by third-party verifiers |

---

## 📊 2. Logging & Monitoring Quality

Bamboo uses **Pino** for structured JSON logging with high performance and low overhead:

- **Request Tracing (`[REQ]`)**: Logs HTTP method, URL, client IP, User-Agent, and query params upon request entry.
- **Middleware Telemetry (`[MIDDLEWARE]`)**: Captures execution checkpoints (`CorsMiddleware`, `PassportInit`, `authRequired`).
- **Response Auditing (`[RES]`)**: Records HTTP status codes, error payloads, and execution latency in milliseconds (`durationMs`).
- **Swagger UI Tracing (`[SWAGGER]`)**: Tracks interactive API usage and documentation spec access.

> [!IMPORTANT]
> **Data Privacy Rule**: Sensitive payload fields (passwords, private keys, credit cards) must NEVER be written to stdout or Pino log outputs.

---

## 🗄️ 3. Database & ORM Performance Standards

To prevent performance bottlenecks when scaling PostgreSQL via Prisma ORM:

1. **Avoid Overfetching**: Always use Prisma `select` or `omit` clauses to pull only required fields.
   ```typescript
   // Recommended: Selective querying
   const user = await prisma.user.findUnique({
       where: { id: userId },
       select: { id: true, email: true, role: true }
   });
   ```
2. **Singleton Connection**: Access Prisma client strictly through `PrismaManager.getClient()` to maintain optimal connection pooling.
3. **Database Indexing**: Foreign keys (`userId`, `postId`, `tagId`) and lookup columns (`slug`, `email`) must have database indices.

---

## 🖥️ 4. Frontend & User Experience (UX) Quality

1. **Form Input Validation**: Validate all inputs locally before firing HTTP requests to prevent unnecessary network roundtrips.
2. **Error Recovery & Feedback**: Use toast notifications to inform users of network errors or validation failures gracefully.
3. **Optimistic Updates & Skeleton Loaders**: Show instant UI feedback during asynchronous content creation and fetching.
4. **Media Resource Optimization**: Use image URL fallbacks (`isLikelyImageUrl`) and handle broken asset links safely.

---

## 🧪 5. Quality Assurance Checklist

Before pushing changes to production, run the following verification steps:

- [ ] **Type Safety**: `npm run typecheck` completes with `0` errors.
- [ ] **Production Build**: `npm run build` succeeds cleanly.
- [ ] **API Verification**: Check Swagger documentation (`/api/v1/swagger`) to verify request models.
- [ ] **Log Verification**: Inspect terminal logs to ensure clean `[REQ]` -> `[MIDDLEWARE]` -> `[RES]` lifecycle execution.

---

## 📜 Maintenance & Standards Compliance

Maintaining usage quality is a continuous process. Update this document as new modules, caching layers, or quality metrics are introduced into the Bamboo platform.
