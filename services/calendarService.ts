import { google } from 'googleapis';
import authService from './authService';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  reminders?: {
    useDefault?: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

export interface CreateEventParams {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  reminderMinutes?: number[];
}

class CalendarService {
  private calendar: any = null;

  private async initializeCalendar() {
    if (this.calendar) return this.calendar;

    try {
      // Get stored tokens
      const { accessToken } = await authService.getStoredTokens();

      if (!accessToken) {
        throw new Error('No access token available. Please sign in again.');
      }

      // Create OAuth2 client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      // Initialize calendar API
      this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      return this.calendar;
    } catch (error) {
      console.error('Error initializing calendar service:', error);

      // Try to refresh tokens if expired
      const refreshedTokens = await authService.refreshTokens();
      if (refreshedTokens.accessToken) {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: refreshedTokens.accessToken });
        this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        return this.calendar;
      }

      throw error;
    }
  }

  async listEvents(options: {
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: string;
  } = {}): Promise<CalendarEvent[]> {
    try {
      const calendar = await this.initializeCalendar();

      const params: any = {
        calendarId: 'primary',
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: options.maxResults || 10,
      };

      if (options.timeMin) {
        params.timeMin = options.timeMin.toISOString();
      }

      if (options.timeMax) {
        params.timeMax = options.timeMax.toISOString();
      }

      const response = await calendar.events.list(params);

      return response.data.items || [];
    } catch (error: any) {
      console.error('Error listing calendar events:', error);

      if (error.code === 401) {
        // Token expired, try refresh once more
        await authService.refreshTokens();
        return this.listEvents(options);
      }

      throw new Error(`Failed to fetch calendar events: ${error.message}`);
    }
  }

  async createEvent(params: CreateEventParams): Promise<CalendarEvent> {
    try {
      const calendar = await this.initializeCalendar();

      const event: any = {
        summary: params.summary,
        start: {
          dateTime: params.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: params.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      if (params.description) {
        event.description = params.description;
      }

      if (params.location) {
        event.location = params.location;
      }

      if (params.attendees && params.attendees.length > 0) {
        event.attendees = params.attendees.map(email => ({ email }));
      }

      if (params.reminderMinutes) {
        event.reminders = {
          useDefault: false,
          overrides: params.reminderMinutes.map(minutes => ({
            method: 'email',
            minutes,
          })),
        };
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating calendar event:', error);

      if (error.code === 401) {
        // Token expired, try refresh once more
        await authService.refreshTokens();
        return this.createEvent(params);
      }

      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  async updateEvent(eventId: string, params: Partial<CreateEventParams>): Promise<CalendarEvent> {
    try {
      const calendar = await this.initializeCalendar();

      // First get the existing event
      const existingEvent = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      const updatedEvent: any = { ...existingEvent.data };

      if (params.summary) updatedEvent.summary = params.summary;
      if (params.description !== undefined) updatedEvent.description = params.description;
      if (params.location !== undefined) updatedEvent.location = params.location;

      if (params.startTime) {
        updatedEvent.start = {
          dateTime: params.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      if (params.endTime) {
        updatedEvent.end = {
          dateTime: params.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      }

      if (params.attendees) {
        updatedEvent.attendees = params.attendees.map(email => ({ email }));
      }

      if (params.reminderMinutes) {
        updatedEvent.reminders = {
          useDefault: false,
          overrides: params.reminderMinutes.map(minutes => ({
            method: 'email',
            minutes,
          })),
        };
      }

      const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: updatedEvent,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error updating calendar event:', error);

      if (error.code === 401) {
        // Token expired, try refresh once more
        await authService.refreshTokens();
        return this.updateEvent(eventId, params);
      }

      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const calendar = await this.initializeCalendar();

      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
    } catch (error: any) {
      console.error('Error deleting calendar event:', error);

      if (error.code === 401) {
        // Token expired, try refresh once more
        await authService.refreshTokens();
        return this.deleteEvent(eventId);
      }

      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }

  async getEvent(eventId: string): Promise<CalendarEvent> {
    try {
      const calendar = await this.initializeCalendar();

      const response = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      return response.data;
    } catch (error: any) {
      console.error('Error getting calendar event:', error);

      if (error.code === 401) {
        // Token expired, try refresh once more
        await authService.refreshTokens();
        return this.getEvent(eventId);
      }

      throw new Error(`Failed to get calendar event: ${error.message}`);
    }
  }

  // Utility method to parse natural language dates (basic implementation)
  parseNaturalLanguageDate(text: string): Date | null {
    try {
      const now = new Date();
      const textLower = text.toLowerCase();

      // Today
      if (textLower.includes('today')) {
        return now;
      }

      // Tomorrow
      if (textLower.includes('tomorrow')) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }

      // Next week
      if (textLower.includes('next week')) {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      }

      // Parse time patterns like "2 PM", "14:00", "2:30 PM"
      const timeMatch = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3]?.toLowerCase();

        if (period === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }

        const date = new Date(now);
        date.setHours(hours, minutes, 0, 0);

        // If time is in the past, assume it's for tomorrow
        if (date < now) {
          date.setDate(date.getDate() + 1);
        }

        return date;
      }

      return null;
    } catch (error) {
      console.error('Error parsing natural language date:', error);
      return null;
    }
  }

  // Format event for display
  formatEventForDisplay(event: CalendarEvent): string {
    const startDateTime = event.start.dateTime || event.start.date;
    const endDateTime = event.end.dateTime || event.end.date;

    const startDate = startDateTime ? new Date(startDateTime) : null;
    const endDate = endDateTime ? new Date(endDateTime) : null;

    let formatted = `📅 ${event.summary}`;

    if (startDate) {
      const dateStr = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const timeStr = startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      formatted += `\n📆 ${dateStr} at ${timeStr}`;
    }

    if (event.location) {
      formatted += `\n📍 ${event.location}`;
    }

    if (event.description) {
      formatted += `\n📝 ${event.description}`;
    }

    return formatted;
  }
}

export default new CalendarService();