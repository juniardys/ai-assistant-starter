import { useState, useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import Voice from '@react-native-community/voice';
import geminiService, { ChatMessage } from '../services/geminiService';

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isListening: boolean;
  suggestedResponses: string[];
  sendMessage: (message: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  clearHistory: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  // Update suggested responses based on context
  useEffect(() => {
    const suggestions = geminiService.getSuggestedResponses();
    setSuggestedResponses(suggestions);
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    const setupVoice = async () => {
      try {
        await Voice.destroy().then(Voice.removeAllListeners);

        Voice.onSpeechStart = () => {
          setIsListening(true);
        };

        Voice.onSpeechEnd = () => {
          setIsListening(false);
        };

        Voice.onSpeechResults = (e: any) => {
          if (e.value && e.value.length > 0) {
            const transcript = e.value[0];
            handleMessage(transcript);
          }
        };

        Voice.onSpeechError = (e: any) => {
          console.error('Speech recognition error:', e);
          setIsListening(false);

          if (e.error === 'no_match') {
            Alert.alert('Voice Input', 'Could not understand audio. Please try again.');
          } else {
            Alert.alert('Voice Input Error', 'Failed to process voice input. Please try again.');
          }
        };
      } catch (error) {
        console.error('Error setting up voice recognition:', error);
      }
    };

    setupVoice();
  }, []);

  const handleMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await geminiService.sendMessage(messageText);

      // Add AI response
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    await handleMessage(message);
  };

  const startListening = async () => {
    try {
      setIsListening(true);

      // Check if we have permission
      const isAvailable = await Voice.isAvailable();

      if (!isAvailable) {
        Alert.alert(
          'Voice Input Not Available',
          'Voice recognition is not available on this device.',
          [{ text: 'OK' }]
        );
        setIsListening(false);
        return;
      }

      // Start voice recognition
      await Voice.start('en-US'); // Default to English, but can be changed

    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);

      if (error instanceof Error) {
        if (error.message.includes('network')) {
          Alert.alert(
            'Network Error',
            'Voice recognition requires an internet connection. Please check your connection and try again.',
            [{ text: 'OK' }]
          );
        } else if (error.message.includes('permission')) {
          Alert.alert(
            'Microphone Permission',
            'Please grant microphone permission to use voice input.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Voice Input Error',
            'Failed to start voice recognition. Please try again.',
            [{ text: 'OK' }]
          );
        }
      }
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      setIsListening(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    geminiService.clearChatHistory();
  };

  return {
    messages,
    isLoading,
    isListening,
    suggestedResponses,
    sendMessage,
    startListening,
    stopListening,
    clearHistory
  };
};