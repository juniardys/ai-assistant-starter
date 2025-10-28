# Frontend Guideline Document

This document outlines the frontend setup for the `ai-assistant-starter` project—a cross-platform mobile app template built with Expo and Firebase. It explains how the architecture, design choices, and technologies work together to deliver a responsive, scalable, and maintainable AI assistant experience.

---

## Frontend Architecture

### Overview of Frameworks and Libraries
- **Expo (SDK 52)**: Manages builds, provides access to native APIs (Calendar, Notifications), and simplifies deployments for iOS, Android, and web.
- **React Native**: Core library for building native UI components across platforms.
- **TypeScript**: Adds static typing for safer, more maintainable code.
- **Expo Router**: File-based routing system that maps screen files under `app/` directly to routes.
- **Firebase**:
  - **Authentication**: Google Sign-In and session management.
  - **Firestore/Realtime Database**: Real-time data storage and synchronization.
- **React Native Reanimated**: High-performance animations and gesture handling.
- **react-native-dotenv**: Securely loads sensitive keys (e.g., Google OAuth Client ID) from `.env` files.

### Scalability, Maintainability, Performance
- **Modular Structure**: Separates routes (`app/`), UI components (`components/`), services (`services/`), and hooks (`hooks/`), making it easy to add features without tangled code.
- **File-Based Routing**: Adding a new screen is as simple as creating a file in `app/`, reducing boilerplate and easing navigation updates.
- **Service Layers**: Abstracts API logic into `services/google.ts` and `services/database.ts`, so UI components only focus on rendering.
- **TypeScript**: Early error detection and clearer contracts between modules.
- **Animation Library**: Offloads heavy work to native threads for smooth interactions.

---

## Design Principles

1. **Usability**
   - Intuitive navigation via bottom tabs and clear route names.
   - Consistent button, input, and list styles across screens.
   - Immediate feedback on user actions (loading spinners, disabled states).

2. **Accessibility**
   - All interactive elements include `accessibilityLabel` and proper roles.
   - Color contrasts meet WCAG AA standards in both light and dark themes.
   - Support for screen readers and focus management during navigation.

3. **Responsiveness**
   - Layout components use `flex`, `Dimensions`, and percentage-based sizing.
   - Media queries (via React Native’s `useWindowDimensions`) adjust grid and list views for tablets and larger devices.
   - File-based routing ensures each screen can adapt its own layout logic.

These principles guide every UI decision, from font sizes to animation timing, ensuring a friendly and inclusive user experience.

---

## Styling and Theming

### Styling Approach
- Uses **React Native’s built-in StyleSheet** combined with **inline style objects** for quick tweaks.
- **Themed Components**: A `ThemeContext` provides colors, spacing, and typography tokens to styled building blocks.
- Centralized tokens live in `constants/Colors.ts` and `constants/Fonts.ts`.

### Theming Strategy
- **Dual Themes**: Light and dark modes are defined in `theme/light.ts` and `theme/dark.ts`.
- The current theme is consumed via a `ThemeProvider` at the root (`app/_layout.tsx`), so every component updates when the theme changes.
- Users can switch modes, and the choice persists in local storage.

### Visual Style
- **Style**: Modern flat design with subtle glassmorphic touches on modals and cards (semi-transparent backgrounds with light blur).
- **Color Palette**:
  - Primary: `#4A90E2` (blue)
  - Secondary: `#48BB78` (green)
  - Accent: `#ED8936` (orange)
  - Background Light: `#FFFFFF`
  - Background Dark: `#1A202C`
  - Text Light: `#2D3748`
  - Text Dark: `#EDF2F7`

- **Fonts**: Uses **Roboto** (or system font fallback) for a clean, approachable look. Headings and buttons use a slightly heavier weight (500), body text uses 400.

---

## Component Structure

### Organization
- **`app/`**: Screen components organized by route. E.g., `/chat`, `/tasks`, `/calendar`.
- **`components/`**: Reusable UI elements (buttons, input fields, cards).
- **`services/`**: API clients (Google Calendar, Gemini, Firestore operations).
- **`hooks/`**: Custom hooks (`useCalendarEvents`, `useGemini`) to encapsulate data fetching and business logic.
- **`constants/`**: Design tokens (colors, fonts).

### Benefits of Component-Based Architecture
- **Reusability**: Build once, use everywhere (e.g., `ChatBubble`, `TaskItem`, `CalendarView`).
- **Maintainability**: Small, focused components are easy to test and debug.
- **Consistency**: Shared style or behavior changes ripple through the app by updating a single component.

---

## State Management

### Current Approach
- **React Hooks**: `useState` for local state and `useContext` for theme and authentication state.
- Lightweight and easy to start with when the app is small.

### Future Considerations
- As features grow (chat history, calendar events, task lists), consider a dedicated library:
  - **Zustand**: Simple API, minimal boilerplate.
  - **Redux Toolkit**: Structured slices, built-in dev tools, and middleware support.

### Shared State
- **AuthContext**: Tracks user login status and OAuth tokens.
- **ThemeContext**: Manages light/dark mode and design tokens.
- **Service Hooks**: Keep fetched data and loading flags close to the components that need them, reducing prop drilling.

---

## Routing and Navigation

- **Expo Router** handles navigation based on file structure:
  - `app/_layout.tsx` wraps all screens with providers (Auth, Theme).
  - `app/(tabs)/` contains tab-based screens.
  - Route names match file names, making deep linking straightforward (e.g., `/calendar`).
- **Nested Layouts** allow shared UI (like bottom tabs or headers) without repeating code.
- **Route Params** enable passing IDs or filter options (for example, opening a specific chat thread).

---

## Performance Optimization

- **Lazy Loading**: Screens load only when first accessed, reducing initial bundle size.
- **Code Splitting**: Expo Router automatically splits code by route.
- **Asset Bundling**: Optimized images and vector icons shrink app size.
- **Memoization**: `useMemo` and `useCallback` prevent unnecessary re-renders in big lists or chat message streams.
- **Off-thread Animations**: React Native Reanimated keeps animations smooth by running on the UI thread.

Together, these techniques lead to faster startup times, lower memory use, and snappy interactions.

---

## Testing and Quality Assurance

### Testing Strategies
1. **Unit Tests** (Jest + React Native Testing Library)
   - Test individual components and utility functions.
   - Mock Firebase and Google API calls.

2. **Integration Tests**
   - Verify that related components work together (e.g., `ChatScreen` with `ChatBubble`).

3. **End-to-End (E2E) Tests**
   - Use **Detox** (or **Cypress** for web) to simulate real user interactions across login, chat, tasks, and calendar flows.

### Quality Tools
- **ESLint** with TypeScript rules for consistent code style.
- **Prettier** for automatic formatting.
- **Type Checking** on every commit with `tsc --noEmit`.
- **CI Pipeline**: GitHub Actions or EAS Build runs tests, linting, and type checks on every pull request.

---

## Conclusion and Overall Frontend Summary

This guideline captures how the `ai-assistant-starter` frontend is built for growth, reliability, and a polished user experience. We lean on Expo and React Native for rapid cross-platform development, Firebase for real-time data and auth, and a clear component hierarchy that keeps code organized and testable.

By following these recommendations—modular services, robust state management, consistent theming, and automated quality checks—you’ll maintain a clean codebase that can easily absorb new features like deeper Gemini integration, calendar event editing, background reminders, and beyond. The result is a performant, accessible, and delightful personal AI assistant app that feels like a natural extension of the user’s daily routine.