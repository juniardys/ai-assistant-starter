# Security Guidelines for `ai-assistant-starter`

This document provides a comprehensive set of security best practices and controls tailored for the `ai-assistant-starter` repository—a cross-platform Expo + React Native application using Firebase Authentication, Firestore/Realtime Database, and integrations with Google Calendar and Gemini APIs.

---

## 1. Security by Design & Secure Defaults

- **Threat Modeling**: Identify and document attack surfaces (authentication endpoints, API integrations, file uploads, background tasks) early in design.
- **Secure Configuration**: Ship the app with restrictive defaults (e.g., Firebase security rules blocking all reads/writes until explicitly allowed).
- **Principle of Least Privilege**: Grant only the minimal OAuth scopes needed (e.g., `https://www.googleapis.com/auth/calendar.readonly` if write isn’t required).
- **Defense in Depth**: Combine client-side checks (input length, format) with robust server-side validation.

---

## 2. Authentication & Access Control

- **Firebase Authentication**:
  - Enforce strong password policies if using Email/Password (minimum length, complexity).
  - Use Google Sign-In with OAuth 2.0, requesting scopes in a single consent screen to prevent scope creep.
  - Implement Multi-Factor Authentication (MFA) for admin or high-privilege accounts.
- **Session Management**:
  - Rely on Firebase’s ID tokens; enforce short token lifetimes and refresh tokens securely.
  - Securely store tokens using Expo Secure Store (not AsyncStorage/localStorage).
  - Invalidate tokens on logout and detect session fixation.
- **Role-Based Access Control (RBAC)**:
  - Define custom claims in Firebase (e.g., `role: "user"` vs. `role: "admin"`).
  - Perform server‐side checks on every cloud function and Firestore rule.

---

## 3. Input Validation & Output Encoding

- **Client‐Side & Server‐Side Validation**:
  - Validate all form inputs (task titles, note contents) on both ends.
  - Use TypeScript types and Zod/Yup schemas for data contracts.
- **Prevent Injection**:
  - Use Firestore’s structured queries—avoid constructing raw queries from user input.
  - Sanitize any HTML or Markdown before rendering in WebView or HTML components.
- **File Upload Security** (if applicable):
  - Restrict file types, size limits, and scan for malware using Cloud Functions.
  - Store uploads in Firebase Storage with storage rules limiting user access.

---

## 4. Data Protection & Privacy

- **Encryption in Transit & At Rest**:
  - Enforce TLS 1.2+ for all network calls (Firebase, Google APIs, custom endpoints).
  - Firebase encrypts data at rest—ensure database backups are also encrypted.
- **Secrets Management**:
  - Never commit `.env` values; use `react-native-dotenv` to load client IDs and secrets at build time.
  - In CI/CD, integrate with a secrets manager (GitHub Secrets, Azure Key Vault, etc.).
- **Privacy Compliance**:
  - Minimize PII collection; implement data retention policies per GDPR/CCPA.
  - Provide users with clear consent dialogs when requesting calendar scope.

---

## 5. API & Service Security

- **HTTPS Enforcement**: Enforce secure endpoints for any custom functions (HSTS headers if hosting web).  
- **Rate Limiting & Throttling**: Protect cloud functions and your own API from abuse (e.g., Firebase Cloud Functions with concurrent execution limits).
- **CORS Configuration**: If serving a web version, restrict origins in `app.json` and any custom Express/CORS configs.
- **API Versioning**: When adding Google Calendar/Gemini wrappers in `services/google.ts`, encode the API version in the URL to support future upgrades.

---

## 6. Mobile Application Security Hygiene

- **Secure Storage**:
  - Use `expo-secure-store` for tokens and sensitive user data instead of AsyncStorage.
- **Certificate Pinning**:
  - Consider implementing SSL pinning to guard against man-in-the-middle on public networks.
- **Platform Permissions**:
  - Request only necessary device permissions (Calendar, Notifications) at runtime with clear user prompts.
- **Debug Features**:
  - Disable remote debugging and verbose logging in production builds (`__DEV__` checks).
- **Code Obfuscation**:
  - Use Metro’s obfuscation/minification for production to make reverse engineering harder.

---

## 7. Infrastructure, CI/CD & DevOps Security

- **Firebase Security Rules**:
  - Enforce rules so users can read/write only their own documents: `allow read, write: if request.auth.uid == resource.data.ownerId`.
  - Test rules with the Firebase Emulator Suite before deployment.
- **CI/CD Pipeline**:
  - Build on CI with least-privileged service accounts.
  - Integrate SAST (ESLint with security plugins) and SCA (GitHub Dependabot, `npm audit`) in PR checks.
  - Automate EAS Build deployments on approved releases.
- **Infrastructure Hardening**:
  - Use IAM roles for Firebase service accounts limiting function access.
  - Rotate credentials periodically and monitor audit logs.

---

## 8. Dependency Management

- **Lockfiles**: Commit `package-lock.json` to ensure deterministic builds.
- **Vulnerability Scanning**: Run regular `npm audit` and integrate tools like Snyk or GitHub Advanced Security.
- **Minimize Footprint**: Remove unused Expo modules and third-party libraries to reduce attack surface.
- **Patch Management**: Schedule periodic dependency updates and regression tests.

---

By implementing these guidelines, you’ll build a robust, secure foundation for your personal AI assistant. Always review and iterate on your security posture as your application evolves and new threats emerge.