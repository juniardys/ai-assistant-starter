import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import id from './id.json';

// English translations (fallback)
const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    retry: 'Retry'
  },
  auth: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signInWithGoogle: 'Continue with Google',
    welcome: 'Welcome',
    signOutTitle: 'Sign Out',
    signOutMessage: 'Are you sure you want to sign out?',
    authenticationRequired: 'Authentication Required',
    pleaseSignIn: 'Please sign in to continue'
  },
  home: {
    welcome: 'Welcome to AI Assistant',
    subtitle: 'Your personal assistant for managing schedules, reminders, and tasks',
    quickActions: 'Quick Actions',
    chatWithAI: 'Chat with AI',
    chatDescription: 'Ask questions and get help',
    calendar: 'Calendar',
    calendarDescription: 'View and manage events',
    tasks: 'Tasks',
    tasksDescription: 'Manage your to-do list',
    notes: 'Notes',
    notesDescription: 'Quick notes and thoughts',
    trySaying: 'Try saying:',
    scheduleMeeting: 'Schedule a meeting for tomorrow at 2 PM',
    showCalendar: 'Show me my calendar for this week',
    addReminder: 'Add a reminder to call mom'
  },
  chat: {
    title: 'AI Assistant',
    subtitle: 'Your personal calendar and scheduling assistant',
    placeholder: 'Ask me about your schedule...',
    suggestions: 'Suggested Questions',
    listening: 'Listening... Speak now',
    thinking: 'AI is thinking...',
    welcomeTitle: 'Welcome to AI Assistant!',
    welcomeSubtitle: 'I can help you manage your calendar, schedule meetings, and set reminders.',
    welcomeHint: 'Try saying: "Show me my calendar for today" or "Schedule a meeting for tomorrow at 2 PM"',
    voiceInputNotAvailable: 'Voice Input Not Available',
    voiceNotAvailableMessage: 'Voice recognition is not available on this device.',
    networkError: 'Network Error',
    networkErrorMessage: 'Voice recognition requires an internet connection. Please check your connection and try again.',
    microphonePermission: 'Microphone Permission',
    microphonePermissionMessage: 'Please grant microphone permission to use voice input.',
    voiceInputError: 'Voice Input Error',
    voiceInputErrorMessage: 'Failed to start voice recognition. Please try again.',
    couldNotUnderstand: 'Could not understand audio. Please try again.',
    suggestedQuestions: [
      'Show me my calendar for today',
      'Schedule a meeting for tomorrow at 2 PM',
      'What meetings do I have this week?',
      'Create a reminder to call mom'
    ]
  },
  calendar: {
    title: 'Calendar',
    noEvents: 'No events found',
    createEvent: 'Create Event',
    editEvent: 'Edit Event',
    deleteEvent: 'Delete Event',
    eventCreated: 'Event created successfully!',
    eventUpdated: 'Event updated successfully!',
    eventDeleted: 'Event deleted successfully!',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete this event?',
    eventTitle: 'Event Title',
    description: 'Description',
    startTime: 'Start Time',
    endTime: 'End Time',
    location: 'Location',
    attendees: 'Attendees',
    addEvent: 'Add Event',
    yourEvents: 'Your calendar events:',
    noEventsInRange: 'No events found in the specified time range.'
  },
  tasks: {
    title: 'Tasks',
    addTask: 'Add Task',
    editTask: 'Edit Task',
    deleteTask: 'Delete Task',
    taskTitle: 'Task Title',
    taskDescription: 'Task Description',
    dueDate: 'Due Date',
    priority: 'Priority',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    completed: 'Completed',
    pending: 'Pending',
    markCompleted: 'Mark as Completed',
    taskCreated: 'Task created successfully!',
    taskUpdated: 'Task updated successfully!',
    taskDeleted: 'Task deleted successfully!',
    noTasks: 'No tasks',
    completedTasks: 'Completed Tasks',
    pendingTasks: 'Pending Tasks'
  },
  notes: {
    title: 'Notes',
    addNote: 'Add Note',
    editNote: 'Edit Note',
    deleteNote: 'Delete Note',
    noteTitle: 'Note Title',
    noteContent: 'Note Content',
    createdAt: 'Created at',
    lastModified: 'Last modified',
    noteCreated: 'Note created successfully!',
    noteUpdated: 'Note updated successfully!',
    noteDeleted: 'Note deleted successfully!',
    noNotes: 'No notes',
    searchNotes: 'Search notes...'
  },
  errors: {
    generic: 'An error occurred. Please try again.',
    network: 'Network error. Please check your internet connection.',
    authentication: 'Authentication error. Please sign in again.',
    permission: 'Permission denied. Please grant the required permissions.',
    notFound: 'Page not found.',
    serverError: 'Server error. Please try again later.',
    validation: 'Validation error. Please check your input.',
    calendar: 'Failed to access calendar. Please check permissions and try again.',
    speechRecognition: 'Speech recognition failed. Please try again.',
    ai: 'An error occurred with the AI. Please try again.'
  },
  success: {
    operationCompleted: 'Operation completed successfully!',
    dataSaved: 'Data saved successfully!',
    dataUpdated: 'Data updated successfully!',
    dataDeleted: 'Data deleted successfully!'
  },
  time: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    nextWeek: 'Next week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    nextMonth: 'Next month',
    lastMonth: 'Last month',
    ago: 'ago',
    in: 'in',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    years: 'years'
  }
};

const resources = {
  en: { translation: en },
  id: { translation: id },
};

// Get device language
const deviceLanguage = Localization.locale.split('-')[0] || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage === 'id' ? 'id' : 'en', // Default to Indonesian if device language is Indonesian
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;