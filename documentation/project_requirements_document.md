# Project Requirements Document (PRD)

## 1. Project Overview

**Paragraph 1**  
The _ai-assistant-starter_ project is a cross-platform mobile application built on Expo and Firebase that serves as a foundation for a personal AI assistant. Users will be able to manage schedules, reminders, notes, and tasks from a single app, with seamless integration into their Google ecosystem (Google Sign-In, Google Calendar, and Google’s Gemini AI). The starter template handles authentication, real-time data sync, theming, and navigation, so development can focus on the assistant’s unique features instead of boilerplate.

**Paragraph 2**  
This app solves the fragmentation of tools—no more juggling separate calendar apps, to-do lists, and note pads. By unifying them under an AI-driven interface, it simplifies planning, automates routine tasks, and keeps data consistent across devices. Key objectives for v1 are: frictionless Google Sign-In, a responsive AI chat interface that can read/write calendar events, basic task and note management, and real-time syncing. Success means a new user can onboard in under a minute, ask the assistant to schedule or list tasks, and immediately see those items reflected in their calendar and task list.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope (v1 Features)**
- Google Sign-In via Firebase Authentication (OAuth with calendar and Gemini scopes)
- AI Chat Interface (Gemini prompts & responses)
- Task Management: Create, read, update, delete (CRUD) tasks with due dates and priorities
- Notes Management: CRUD meeting notes or general notes
- Calendar Integration: Read and write Google Calendar events (month/week/day views)
- Real-Time Data Sync: Firestore or Realtime Database for tasks, notes, preferences
- File-Based Routing: Organized screens under `app/` with Expo Router
- Theming: Light/dark modes and centralized color palette
- Offline Persistence: Basic read/write offline, sync on reconnect
- Basic Local Notifications: Reminders for due tasks (local only)

**Out-of-Scope (Deferred to Later Phases)**
- Advanced background scheduling (e.g., recurring reminders via `expo-task-manager`)
- Voice input/output and speech recognition
- Multi-language support/localization
- Analytics dashboard or reporting tools
- Third-party integrations beyond Google (e.g., Microsoft 365)
- Collaborative features (shared calendars/tasks)
- Long-term AI training or user behavior modeling

---

## 3. User Flow

**Paragraph 1**  
A new user opens the app and lands on the **Sign-In** screen. They tap “Continue with Google,” select their account, and grant permissions for Calendar and Gemini AI. Upon successful login, the app checks for authentication and redirects the user to the **Home** screen—a bottom-tab layout with four tabs: Chat, Tasks, Calendar, and Settings.

**Paragraph 2**  
From the **Chat** tab, the user types a query (e.g., “Schedule a team meeting tomorrow at 10 AM”) and the AI responds with a formatted confirmation. If accepted, it creates a calendar event and stores a task in Firestore. The user switches to **Tasks** to see the new item, marks it complete, or edits details. Under **Calendar**, they view the event in a week or month grid. All changes sync instantly across devices. In **Settings**, the user can toggle dark mode or sign out.

---

## 4. Core Features

- **Authentication**  
  • Google Sign-In using Firebase Auth with OAuth scopes for Calendar and Gemini API.  
  • Global auth state management that guards protected routes.

- **AI Chat Interface**  
  • Text input and message bubbles for user & AI.  
  • Integration with Gemini API via a custom hook (`useGemini`).  
  • Loading indicators, error messages, and message timestamps.

- **Task Management**  
  • CRUD tasks with title, description, due date, priority, and status.  
  • TaskItem component with swipe-to-delete and completion toggle.  
  • Real-time updates via Firestore/RTDB listeners.

- **Notes Management**  
  • CRUD notes with optional folder or tag assignment.  
  • Offline editing and automatic sync on reconnect.

- **Calendar Integration**  
  • Read/write events using Google Calendar REST API or `expo-calendar`.  
  • Month/week/day views with tappable events.  
  • Two-way sync: external changes appear in the app in real time.

- **Real-Time Data Sync**  
  • Firestore or Realtime Database for all user data.  
  • Offline persistence with local caching.

- **Theming & UI**  
  • Light/dark themes via context.  
  • Responsive layouts for phones, tablets, and web.

- **Navigation**  
  • File-based routing with Expo Router.  
  • Nested layouts for shared chrome (bottom tabs, headers).

- **Notifications**  
  • Local reminders for tasks.  
  • Permission prompts and graceful fallbacks.

- **Service Layer**  
  • `services/google.ts` for Calendar & Gemini calls.  
  • `services/database.ts` for Firestore interactions.

---

## 5. Tech Stack & Tools

- Frontend:  
  • Expo SDK 52 (React Native)  
  • Expo Router (file-based routing)  
  • React Native Reanimated (animations)  
  • TypeScript  
  • `react-native-dotenv` (env var management)

- Backend & Data:  
  • Firebase Authentication (Google provider)  
  • Firestore or Realtime Database (real-time sync)  
  • Firebase Security Rules (data access control)

- AI Integration:  
  • Google Gemini API client (via REST or SDK)  
  • Custom React hook (`useGemini`) for prompt handling

- Calendar API:  
  • Google Calendar REST API or Expo’s `expo-calendar`

- State Management:  
  • React hooks (`useState`, `useContext`)  
  • Recommendation: plan for Zustand or Redux Toolkit if complexity grows

- IDE & Plugins:  
  • Visual Studio Code  
  • Expo DevTools  
  • React Native Debugger

---

## 6. Non-Functional Requirements

- **Performance**  
  • Cold start time < 3 seconds on modern devices.  
  • Chat responses (Gemini) displayed within 2 seconds on average.  
  • Real-time updates propagate in < 1 second.

- **Security & Compliance**  
  • Secure storage of OAuth tokens with `react-native-keychain` or SecureStore.  
  • Firebase Security Rules to enforce per-user data isolation.  
  • GDPR-friendly data handling (opt-in analytics, clear privacy policy).

- **Usability & Accessibility**  
  • WCAG-compliant color contrast for text/buttons.  
  • `accessibilityLabel` on interactive elements.  
  • Touch targets ≥ 44×44 px.  
  • Support for portrait & landscape orientations.

- **Reliability**  
  • Offline read/write with sync retry on reconnect.  
  • Graceful error handling with user feedback for network/API failures.

---

## 7. Constraints & Assumptions

- Requires stable availability of Google Gemini API and Google Calendar API.  
- Assumes Firebase free tier is sufficient for initial user base.  
- Expo’s managed workflow must support all required native modules (calendar, notifications).  
- Users must have Google accounts and grant necessary OAuth scopes.  
- Theming and layout assume a minimum iOS 12 / Android 8.0 baseline.

---

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**  
  • Google Calendar & Gemini have quotas; implement exponential backoff and caching.

- **Firebase Security Misconfiguration**  
  • Default open rules can expose user data; enforce strict read/write rules per UID.

- **Platform Differences**  
  • `expo-calendar` has limited web support; consider fallback UI for browsers.

- **Network Instability**  
  • Prompts may fail under poor network; show retry options and offline queueing.

- **Token Expiry & Refresh**  
  • Handle OAuth token refresh gracefully; prompt re-auth only when necessary.

- **Complex State Growth**  
  • React Context may become unwieldy; plan to migrate to a dedicated state library if needed.

*Mitigations:*  
- Implement unified error-handling utilities.  
- Abstract API calls into service modules for easier retry/timeout logic.  
- Write end-to-end tests mocking external APIs.  

---

**End of PRD**  
This document provides a clear, unambiguous blueprint for building the personal AI assistant app on the _ai-assistant-starter_ codebase. Subsequent technical documents (Tech Stack Details, Frontend Guidelines, Backend Structure) can directly reference these sections without further clarification.