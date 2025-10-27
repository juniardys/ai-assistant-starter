# Backend Structure Document

## 1. Backend Architecture

This project uses a serverless, event-driven backend powered by Firebase. We rely on Firebase’s managed services (Authentication, Firestore, Cloud Functions) to minimize operational overhead and ensure we can scale with demand.

Key design patterns and frameworks:

- Serverless Functions (Cloud Functions for Firebase)
- Client-first data access via Firebase SDK
- Microservice-style endpoints for custom logic (Google Calendar, Gemini API)
- TypeScript for type safety and clearer code

How it supports project goals:

- **Scalability**: Google’s infrastructure automatically adds (or removes) capacity for Cloud Functions and Firestore as traffic fluctuates.
- **Maintainability**: Clear separation between data (Firestore), authentication (Firebase Auth), and custom business logic (Cloud Functions).
- **Performance**: Edge-distributed functions and Firestore’s real-time synchronization reduce latency.

## 2. Database Management

We use Google Firestore, a NoSQL document database, to store and sync app data in real time.

Database technologies:

- Firestore (NoSQL) for tasks, notes, chat logs, user preferences
- Firebase Authentication to manage user identities and secure access

Data practices:

- **Collections & Documents**: Data is grouped into logical collections (e.g., `users`, `tasks`, `notes`). Each record is a document with key/value pairs.
- **Offline Persistence**: Clients keep a local cache of Firestore data, so the app works smoothly even when offline.
- **Real-Time Updates**: When one device writes data, all connected devices see changes instantly.

## 3. Database Schema

We structure our data in human-friendly collections and documents. Below is a simplified overview:

1. Collection: `users`
   - Document ID: `uid` (Firebase Auth user ID)
   - Fields:
     • `displayName`: string (e.g., "Jane Doe")
     • `email`: string
     • `photoURL`: string (profile image)
     • `preferences`: map (e.g., `{ theme: "dark", notificationsEnabled: true }`)
   - Subcollections:
     • `tasks` (each task document)
     • `notes` (each note document)
     • `chatMessages` (each chat entry)

2. Collection: `tasks` (alternative flat structure)
   - `id`: auto-generated
   - `ownerId`: string (refers to `users/uid`)
   - `title`: string
   - `description`: string
   - `dueDate`: timestamp
   - `completed`: boolean
   - `priority`: string (e.g., "high", "medium", "low")

3. Collection: `notes`
   - `id`: auto-generated
   - `ownerId`: string
   - `content`: string
   - `createdAt`: timestamp
   - `tags`: array of strings

4. Collection: `chatMessages`
   - `id`: auto-generated
   - `ownerId`: string
   - `sender`: string ("user" or "assistant")
   - `message`: string
   - `timestamp`: timestamp

5. (Optional) Collection: `calendarEvents`
   - `id`: auto-generated
   - `ownerId`: string
   - `googleEventId`: string
   - `title`, `startTime`, `endTime`, `description`

## 4. API Design and Endpoints

We use Cloud Functions to expose custom business logic via HTTP endpoints. Authentication is enforced through Firebase ID tokens.

Approach: RESTful HTTP functions.

Key endpoints:

- **POST /api/v1/chat**
  • Purpose: Send a user message to the Gemini API and return the AI reply.
  • Workflow: Verify Firebase Auth token → forward message to Gemini → persist both user and assistant messages in `chatMessages` → return AI response.

- **GET /api/v1/calendar**
  • Purpose: Fetch upcoming Google Calendar events for the authenticated user.
  • Workflow: Verify token → call Google Calendar API with stored OAuth credentials → return events list.

- **POST /api/v1/calendar**
  • Purpose: Create or update an event in the user’s Google Calendar.
  • Workflow: Verify token → forward event data to Google Calendar API → store local copy in `calendarEvents` if desired.

- **GET /api/v1/tasks**
  • Purpose: Retrieve the user’s tasks from Firestore.

- **POST /api/v1/tasks**
  • Purpose: Create a new task.

- **PUT /api/v1/tasks/:taskId**
  • Purpose: Update an existing task.

- **DELETE /api/v1/tasks/:taskId**
  • Purpose: Delete a task.

All endpoints require a valid Firebase ID token in the `Authorization` header.

## 5. Hosting Solutions

We host our backend entirely on Google Cloud via Firebase:

- **Cloud Functions for Firebase**: Runs our custom logic (API endpoints) in a fully managed, auto-scaled environment.
- **Cloud Firestore**: A globally distributed database with built-in replication.
- **Firebase Hosting** (optional): Can serve static assets or a companion web client via a global CDN.

Benefits:

- **Reliability**: Google’s SLAs cover uptime for functions and Firestore.
- **Scalability**: No capacity planning—services grow with traffic.
- **Cost-Effectiveness**: Pay only for the resources you use; generous free tiers for development.

## 6. Infrastructure Components

Our backend is composed of these managed services working together:

- **Firebase Authentication**: Central user identity and session management.
- **Cloud Firestore**: Real-time data storage and syncing.
- **Cloud Functions**: Serverless compute for custom endpoints.
- **Cloud IAM & Security Rules**: Fine-grained access control for Firestore data.
- **Firebase Hosting & CDN**: (Optional) Delivers static content around the globe.
- **Client-Side Caching**: Firestore SDK caches data locally for offline use.

These pieces work seamlessly:

1. User signs in via Firebase Auth →
2. Frontend reads/writes data directly to Firestore or calls HTTP functions →
3. Cloud Functions enforce business rules, call external APIs, and log actions →
4. Firestore pushes real-time updates back to all connected clients.

## 7. Security Measures

We follow best practices to protect user data and meet compliance requirements:

- **Authentication & Authorization**
  • Firebase Auth with Google Sign-In for identity.
  • ID token verification on every HTTP function.
  • Firestore Security Rules to ensure users only access their own data.

- **Data Encryption**
  • All traffic over HTTPS/TLS.
  • Firestore data encrypted at rest by Google.

- **OAuth Scopes**
  • Request only the minimum required scopes for Google Calendar and Gemini.
  • Store OAuth tokens securely in Firestore or Cloud Functions environment variables.

- **Environment Configuration**
  • Secrets (Gemini API key, OAuth client secrets) stored in Cloud Functions environment variables, not in source code.

## 8. Monitoring and Maintenance

We track performance, errors, and usage with these tools:

- **Firebase Console & Cloud Monitoring**
  • Function invocation metrics, latency, and error rates.
  • Firestore read/write statistics.

- **Cloud Logging**
  • Structured logs for each function invocation, including request parameters and errors.

- **Firebase Performance Monitoring** (optional)
  • Frontend SDK to measure network request times and app startup.

Maintenance strategy:

- Automatic dependency updates via CI/CD (e.g., GitHub Actions).
- Regular review of Firestore Security Rules.
- Scheduled audits of OAuth scopes and API usage.
- Alerts set on high error rates or function timeouts.

## 9. Conclusion and Overall Backend Summary

Our backend is built on a serverless, fully managed platform that leverages Firebase and Google Cloud. By combining Firestore for real-time data, Firebase Auth for secure sign-in, and Cloud Functions for custom AI and calendar logic, we provide a robust foundation for the AI assistant app. This architecture:

- Scales seamlessly with user demand
- Keeps operational complexity low
- Delivers real-time updates and offline support
- Ensures data is protected through strong security controls

With this setup, developers can focus on building rich user experiences—like chat interactions and task management—rather than managing servers or infrastructure. The result is a responsive, secure, and maintainable backend that aligns perfectly with our goal of a personal AI assistant integrated into the Google ecosystem.