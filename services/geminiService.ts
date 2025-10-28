import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import calendarService, { CalendarEvent } from './calendarService';
import authService from './authService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  functionCall?: any;
}

export interface FunctionCall {
  name: string;
  parameters: any;
}

export interface FunctionResponse {
  name: string;
  response: any;
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private chatHistory: ChatMessage[] = [];
  private maxHistoryLength = 10;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Get access token from auth service
      const { accessToken } = await authService.getStoredTokens();

      if (!accessToken) {
        throw new Error('No access token available. Please sign in again.');
      }

      // Initialize Google Generative AI with access token
      this.genAI = new GoogleGenerativeAI(accessToken);

      // Use gemini-pro model for chat with function calling
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-pro',
        tools: [
          {
            functionDeclarations: [
              {
                name: 'createCalendarEvent',
                description: 'Create a new calendar event',
                parameters: {
                  type: 'object',
                  properties: {
                    summary: {
                      type: 'string',
                      description: 'Title or summary of the event'
                    },
                    description: {
                      type: 'string',
                      description: 'Description of the event (optional)'
                    },
                    startTime: {
                      type: 'string',
                      description: 'Start time in ISO format or natural language (e.g., "tomorrow at 2 PM")'
                    },
                    endTime: {
                      type: 'string',
                      description: 'End time in ISO format or natural language (e.g., "tomorrow at 3 PM")'
                    },
                    location: {
                      type: 'string',
                      description: 'Location of the event (optional)'
                    },
                    attendees: {
                      type: 'array',
                      items: {
                        type: 'string'
                      },
                      description: 'List of attendee email addresses (optional)'
                    }
                  },
                  required: ['summary', 'startTime', 'endTime']
                }
              },
              {
                name: 'listEvents',
                description: 'List calendar events',
                parameters: {
                  type: 'object',
                  properties: {
                    timeMin: {
                      type: 'string',
                      description: 'Start time for filtering events (ISO format or natural language)'
                    },
                    timeMax: {
                      type: 'string',
                      description: 'End time for filtering events (ISO format or natural language)'
                    },
                    maxResults: {
                      type: 'number',
                      description: 'Maximum number of events to return (default: 10)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'updateEvent',
                description: 'Update an existing calendar event',
                parameters: {
                  type: 'object',
                  properties: {
                    eventId: {
                      type: 'string',
                      description: 'ID of the event to update'
                    },
                    summary: {
                      type: 'string',
                      description: 'New title or summary of the event'
                    },
                    description: {
                      type: 'string',
                      description: 'New description of the event'
                    },
                    startTime: {
                      type: 'string',
                      description: 'New start time in ISO format or natural language'
                    },
                    endTime: {
                      type: 'string',
                      description: 'New end time in ISO format or natural language'
                    },
                    location: {
                      type: 'string',
                      description: 'New location of the event'
                    }
                  },
                  required: ['eventId']
                }
              },
              {
                name: 'deleteEvent',
                description: 'Delete a calendar event',
                parameters: {
                  type: 'object',
                  properties: {
                    eventId: {
                      type: 'string',
                      description: 'ID of the event to delete'
                    }
                  },
                  required: ['eventId']
                }
              }
            ]
          }
        ]
      });

    } catch (error) {
      console.error('Error initializing Gemini service:', error);
      throw error;
    }
  }

  private async ensureInitialized() {
    if (!this.model) {
      await this.initialize();
    }
  }

  private parseTimeString(timeStr: string): Date {
    try {
      // Try parsing as ISO date first
      const isoDate = new Date(timeStr);
      if (!isNaN(isoDate.getTime())) {
        return isoDate;
      }

      // Use calendar service natural language parsing
      const parsedDate = calendarService.parseNaturalLanguageDate(timeStr);
      if (parsedDate) {
        return parsedDate;
      }

      // If all else fails, try basic date parsing
      return new Date(timeStr);
    } catch (error) {
      console.error('Error parsing time string:', error);
      return new Date();
    }
  }

  private async executeFunctionCall(functionCall: FunctionCall): Promise<any> {
    try {
      switch (functionCall.name) {
        case 'createCalendarEvent':
          const params = functionCall.parameters;
          const startTime = this.parseTimeString(params.startTime);
          const endTime = this.parseTimeString(params.endTime);

          return await calendarService.createEvent({
            summary: params.summary,
            description: params.description,
            startTime,
            endTime,
            location: params.location,
            attendees: params.attendees,
          });

        case 'listEvents':
          const listParams = functionCall.parameters;
          const timeMin = listParams.timeMin ? this.parseTimeString(listParams.timeMin) : undefined;
          const timeMax = listParams.timeMax ? this.parseTimeString(listParams.timeMax) : undefined;

          return await calendarService.listEvents({
            timeMin,
            timeMax,
            maxResults: listParams.maxResults || 10,
          });

        case 'updateEvent':
          const updateParams = functionCall.parameters;
          const updateStartTime = updateParams.startTime ?
            this.parseTimeString(updateParams.startTime) : undefined;
          const updateEndTime = updateParams.endTime ?
            this.parseTimeString(updateParams.endTime) : undefined;

          return await calendarService.updateEvent(updateParams.eventId, {
            summary: updateParams.summary,
            description: updateParams.description,
            startTime: updateStartTime,
            endTime: updateEndTime,
            location: updateParams.location,
          });

        case 'deleteEvent':
          await calendarService.deleteEvent(functionCall.parameters.eventId);
          return { success: true, message: 'Event deleted successfully' };

        default:
          throw new Error(`Unknown function: ${functionCall.name}`);
      }
    } catch (error) {
      console.error('Error executing function call:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private formatCalendarResponse(response: any, functionName: string): string {
    try {
      switch (functionName) {
        case 'createCalendarEvent':
          return `✅ Event created successfully!\n\n${calendarService.formatEventForDisplay(response)}`;

        case 'listEvents':
          if (response.error) {
            return `❌ Error fetching events: ${response.error}`;
          }
          if (!response || response.length === 0) {
            return '📅 No events found in the specified time range.';
          }

          const eventList = response.map((event: CalendarEvent, index: number) =>
            `${index + 1}. ${calendarService.formatEventForDisplay(event)}`
          ).join('\n\n');

          return `📅 Your calendar events:\n\n${eventList}`;

        case 'updateEvent':
          return `✅ Event updated successfully!\n\n${calendarService.formatEventForDisplay(response)}`;

        case 'deleteEvent':
          return `✅ ${response.message}`;

        default:
          return 'Operation completed successfully.';
      }
    } catch (error) {
      console.error('Error formatting calendar response:', error);
      return 'Operation completed, but there was an error formatting the response.';
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      await this.ensureInitialized();
      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }

      // Add user message to history
      this.chatHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      });

      // Keep history within limits
      if (this.chatHistory.length > this.maxHistoryLength) {
        this.chatHistory = this.chatHistory.slice(-this.maxHistoryLength);
      }

      // Prepare chat context
      const systemPrompt = `You are a helpful AI assistant that helps users manage their calendar and schedule.
You can create, read, update, and delete calendar events using the available functions.
Always be helpful, polite, and provide clear confirmation when actions are completed.
When users ask about scheduling or calendar-related tasks, use the appropriate functions.
If you need more information, ask clarifying questions.
Respond in the same language as the user (support English and Bahasa Indonesia).`;

      const chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'Hello! I\'m your AI calendar assistant. I can help you manage your schedule, create events, and answer questions about your calendar. How can I assist you today?' }]
          },
          ...this.chatHistory.slice(-5).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        ]
      });

      // Send message and get response
      const result = await chat.sendMessage(message);
      const response = result.response;
      const responseText = response.text();

      // Check if there are any function calls
      const functionCalls = response.functionCalls();

      if (functionCalls && functionCalls.length > 0) {
        let finalResponse = '';

        for (const functionCall of functionCalls) {
          // Execute the function
          const functionResult = await this.executeFunctionCall(functionCall);

          // Send function result back to model
          const functionResponse: FunctionResponse = {
            name: functionCall.name,
            response: functionResult
          };

          const followUpResult = await chat.sendMessage([
            {
              functionResponse: functionResponse
            }
          ]);

          const followUpText = followUpResult.response.text();

          // Format the response based on the function executed
          const formattedResponse = this.formatCalendarResponse(functionResult, functionCall.name);
          finalResponse = followUpText.replace(/\[Function result\]/g, formattedResponse);
        }

        // Add assistant response to history
        this.chatHistory.push({
          role: 'assistant',
          content: finalResponse,
          timestamp: new Date(),
          functionCall: functionCalls[0]
        });

        return finalResponse;
      }

      // Add assistant response to history
      this.chatHistory.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      });

      return responseText;

    } catch (error: any) {
      console.error('Error sending message to Gemini:', error);

      // Add error response to history
      const errorMessage = 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.';
      this.chatHistory.push({
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      });

      return errorMessage;
    }
  }

  getChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  clearChatHistory(): void {
    this.chatHistory = [];
  }

  // Helper method to detect if message is calendar-related
  isCalendarRelated(message: string): boolean {
    const calendarKeywords = [
      'calendar', 'schedule', 'meeting', 'appointment', 'event',
      'agenda', 'jadwal', 'janji temu', 'rapat', 'acara', 'kalender',
      'reminder', 'pengingat', 'task', 'tugas'
    ];

    const messageLower = message.toLowerCase();
    return calendarKeywords.some(keyword => messageLower.includes(keyword));
  }

  // Get suggested responses based on context
  getSuggestedResponses(): string[] {
    const suggestions = [
      'Show me my calendar for today',
      'Schedule a meeting for tomorrow at 2 PM',
      'What meetings do I have this week?',
      'Create a reminder to call mom',
      'Tunjukkan jadwal saya hari ini',
      'Jadwalkan rapat besok jam 2 siang',
      'Apa saja rapat yang saya miliki minggu ini?',
      'Buat pengingat untuk telepon ibu'
    ];

    return suggestions.slice(0, 4);
  }
}

export default new GeminiService();