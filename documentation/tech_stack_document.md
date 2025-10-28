# Tech Stack Document for `ai-assistant-starter`

This document explains, in simple terms, why we chose each technology for building a cross-platform personal AI assistant app. It’s designed to help anyone—technical or not—understand how the pieces fit together.

## Frontend Technologies

We chose a combination of tools and libraries to make the user interface fast, attractive, and easy to develop across iOS, Android, and the web.

- **Expo (SDK 52)**
  - Provides a managed workflow so we can access native device features (camera, calendar, notifications) without writing native code.
  - Simplifies building and testing on multiple platforms.

- **React Native**
  - The core library for building mobile UIs using JavaScript and React concepts.
  - Ensures a consistent look and feel across devices.

- **Expo Router**
  - Implements file-based routing: each screen corresponds to a file under `app/`. Adding a new page is as simple as creating a new file.
  - Automatically handles navigation and deep links.

- **TypeScript**
  - Adds type checking to catch errors early and improve code readability.
  - Helps maintain a large codebase as the app grows.

- **React Native Reanimated**
  - Powers smooth, fluid animations (e.g., expanding chat bubbles, swipe-to-delete gestures).
  - Improves perceived performance and user delight.

- **Styling & Theming**
  - Uses a combination of inline styles and reusable themed components.
  - Central color palette and typography tokens allow easy switching between light and dark modes.

- **State Management**
  - Starts with React’s built-in hooks (`useState`, `useContext`).
  - Ready to scale with a dedicated library (e.g., Zustand or Redux Toolkit) for complex state like chat history and calendar events.

- **Environment Variables**
  - Managed by `react-native-dotenv` to keep secret keys (like Google OAuth client IDs) out of the code.

## Backend Technologies

The backend is powered by Firebase, providing user management and real-time data storage without running our own servers.

- **Firebase Authentication**
  - Handles user sign-up and sign-in via Google accounts.
  - Manages OAuth tokens needed to access Google Calendar and Gemini APIs securely.

- **Cloud Firestore or Realtime Database**
  - Stores tasks, notes, reminders, and user preferences.
  - Keeps data in sync across devices in milliseconds, with offline support.

- **Custom Service Layers**
  - `services/google.ts`: Handles all calls to Google Calendar and Gemini APIs, keeping components clean.
  - `services/database.ts`: Encapsulates Firestore/Realtime Database reads and writes.
  - Encourages a clear separation between UI and data logic.

## Infrastructure and Deployment

These choices ensure the project is easy to maintain, test, and deploy as a team.

- **Version Control with Git & GitHub**
  - Manages code history and collaboration.

- **Expo Application Services (EAS) Build**
  - Automates building production-ready apps for iOS and Android in the cloud.

- **CI/CD Pipeline (GitHub Actions)**
  - Runs tests, lints code, and triggers builds on every push.
  - Ensures new changes don’t break existing features and speeds up delivery.

- **Environment Configuration**
  - Uses a `.env` file (with an example in `.env.example`) to manage API keys and other settings.
  - Keeps sensitive information out of source control.

## Third-Party Integrations

To deliver key AI assistant features, we integrate several external services.

- **Google Calendar API**
  - Accessed via Expo’s `expo-calendar` module or direct REST calls.
  - Lets users view, create, and update calendar events right from the app.

- **Google AI (Gemini) SDK**
  - Communicates with the Gemini API for generating AI responses.
  - Uses the user’s Google OAuth token for authentication.

- **Firebase Analytics (optional)**
  - Tracks user engagement and feature usage.
  - Helps guide future improvements.

- **Background Tasks (`expo-task-manager`)**
  - Schedules reminders and local notifications even when the app is closed.

## Security and Performance Considerations

We’ve built in measures to protect user data and keep the app running smoothly.

- **Authentication & Permissions**
  - OAuth 2.0 flow via Firebase Authentication ensures secure access to Google services.
  - Explicitly requests calendar and AI scopes only when needed, with clear user prompts.

- **Firebase Security Rules**
  - Restrict database reads and writes so each user can only access their own data.
  - Prevents unauthorized data leaks.

- **Environment Variable Management**
  - Keeps API keys and OAuth client IDs out of the codebase.

- **Error Handling**
  - Wraps API calls in `try-catch` blocks.
  - Displays friendly messages (e.g., “Could not connect to your calendar. Please try again.”).

- **Offline Support & Caching**
  - Firestore’s offline persistence lets users keep working without internet and syncs changes later.

- **Performance Optimizations**
  - Uses Reanimated for efficient animations.
  - Minimizes re-renders with memoization (`React.memo`, `useCallback`).
  - Splits code via file-based routing to load only what’s needed.

## Conclusion and Overall Tech Stack Summary

This project combines the power of Expo, React Native, Firebase, and Google services to deliver a feature-rich personal AI assistant that:  

- Provides seamless Google Sign-In and secure access to calendar and AI features.  
- Keeps user data in sync across devices in real time, with offline support.  
- Offers a polished, responsive UI with theming and smooth animations.  
- Is easy to develop, test, and deploy thanks to TypeScript, Expo’s managed workflow, and automated CI/CD.  

Together, these technologies form a flexible, scalable, and secure foundation ready to grow into a full-featured AI assistant. Feel free to explore the code structure (especially the `services/` directory) and customize each piece to match your needs.