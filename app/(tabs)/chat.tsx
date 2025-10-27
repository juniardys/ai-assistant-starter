import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useChat } from '@/hooks/useChat';
import { Colors } from '@/constants/Colors';

interface MessageBubbleProps {
  message: any;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <ThemedText style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}>
          {message.content}
        </ThemedText>
      </View>
      <ThemedText style={styles.timeText}>
        {formatTime(message.timestamp)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    opacity: 0.7,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  suggestionsModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  suggestionsList: {
    paddingHorizontal: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  listeningStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0e0',
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  listeningText: {
    fontSize: 14,
    color: '#ff4444',
    marginRight: 12,
  },
  stopListeningButton: {
    padding: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionsButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  voiceButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  voiceButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    paddingRight: 20,
    paddingBottom: 4,
  },
});

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    messages,
    isLoading,
    isListening,
    suggestedResponses,
    sendMessage,
    startListening,
    stopListening,
  } = useChat();

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInputText(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageBubble message={item} isUser={item.role === 'user'} />
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Ionicons name="chatbubble-outline" size={16} color={Colors.light.primary} />
      <ThemedText style={styles.suggestionText}>{item}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ThemedView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              AI Assistant
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Your personal calendar and scheduling assistant
            </ThemedText>
          </View>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            style={styles.messagesList}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => `message-${index}`}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={64} color={Colors.light.primary} />
                <ThemedText style={styles.emptyTitle}>
                  Welcome to AI Assistant!
                </ThemedText>
                <ThemedText style={styles.emptySubtitle}>
                  I can help you manage your calendar, schedule meetings, and set reminders.
                </ThemedText>
                <ThemedText style={styles.emptyHint}>
                  Try saying: "Show me my calendar for today" or "Schedule a meeting for tomorrow at 2 PM"
                </ThemedText>
              </View>
            }
            ListFooterComponent={
              isLoading ? (
                <View style={styles.loadingContainer}>
                  <View style={styles.typingIndicator}>
                    <View style={[styles.typingDot, { backgroundColor: Colors.light.primary }]} />
                    <View style={[styles.typingDot, { backgroundColor: Colors.light.primary }]} />
                    <View style={[styles.typingDot, { backgroundColor: Colors.light.primary }]} />
                  </View>
                  <ThemedText style={styles.typingText}>AI is thinking...</ThemedText>
                </View>
              ) : null
            }
          />

          {/* Suggestions Modal */}
          <Modal
            visible={showSuggestions}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowSuggestions(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowSuggestions(false)}
            >
              <View style={styles.suggestionsModal}>
                <View style={styles.suggestionsHeader}>
                  <ThemedText style={styles.suggestionsTitle}>
                    Suggested Questions
                  </ThemedText>
                  <TouchableOpacity onPress={() => setShowSuggestions(false)}>
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={suggestedResponses}
                  renderItem={renderSuggestion}
                  keyExtractor={(item, index) => `suggestion-${index}`}
                  style={styles.suggestionsList}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            {/* Voice Status */}
            {isListening && (
              <View style={styles.listeningStatus}>
                <View style={[styles.listeningDot, { backgroundColor: '#ff4444' }]} />
                <ThemedText style={styles.listeningText}>
                  Listening... Speak now
                </ThemedText>
                <TouchableOpacity onPress={stopListening} style={styles.stopListeningButton}>
                  <Ionicons name="stop-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputRow}>
              {/* Suggestions Button */}
              <TouchableOpacity
                style={styles.suggestionsButton}
                onPress={() => setShowSuggestions(true)}
              >
                <Ionicons name="help-circle-outline" size={20} color={Colors.light.primary} />
              </TouchableOpacity>

              {/* Text Input */}
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me about your schedule..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
                textAlignVertical="center"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />

              {/* Send Button */}
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { opacity: inputText.trim() ? 1 : 0.5 }
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={inputText.trim() ? Colors.light.primary : '#ccc'}
                />
              </TouchableOpacity>

              {/* Voice Button */}
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonActive
                ]}
                onPress={handleVoiceInput}
                disabled={isLoading}
              >
                <Ionicons
                  name={isListening ? 'mic' : 'mic-outline'}
                  size={20}
                  color={isListening ? '#fff' : Colors.light.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Character Count */}
            <ThemedText style={styles.charCount}>
              {inputText.length}/500
            </ThemedText>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}