import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading, signIn, isAuthenticated, error, clearError } = useAuth();

  const quickActions = [
    {
      id: 'chat',
      title: t('home.chatWithAI'),
      description: t('home.chatDescription'),
      icon: 'chatbubble-ellipses-outline',
      color: Colors.light.primary,
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      id: 'calendar',
      title: t('home.calendar'),
      description: t('home.calendarDescription'),
      icon: 'calendar-outline',
      color: Colors.light.primary,
      onPress: () => router.push('/(tabs)/calendar'),
    },
    {
      id: 'tasks',
      title: t('home.tasks'),
      description: t('home.tasksDescription'),
      icon: 'checkmark-circle-outline',
      color: Colors.light.primary,
      onPress: () => router.push('/(tabs)/tasks'),
    },
    {
      id: 'notes',
      title: t('home.notes'),
      description: t('home.notesDescription'),
      icon: 'document-text-outline',
      color: Colors.light.primary,
      onPress: () => router.push('/(tabs)/notes'),
    },
  ];

  // Handle loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </View>
    );
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.content}>
            <View style={styles.authPromptContainer}>
              <Ionicons name="person-circle-outline" size={80} color={Colors.light.primary} />
              <ThemedText type="title" style={styles.title}>
                {t('home.welcome')}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {t('home.subtitle')}
              </ThemedText>

              {error && (
                <View style={styles.errorContainer}>
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                  <TouchableOpacity style={styles.retryButton} onPress={clearError}>
                    <ThemedText style={styles.retryButtonText}>Dismiss</ThemedText>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.signInButton}
                onPress={() => router.push('/login')}
              >
                <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.buttonIcon} />
                <ThemedText style={styles.signInButtonText}>Sign In</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {t('home.welcome')}
          </ThemedText>

          <ThemedText style={styles.subtitle}>
            {t('home.subtitle')}
          </ThemedText>

          <View style={styles.actionsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t('home.quickActions')}
            </ThemedText>

            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
                  <ThemedText style={styles.actionDescription}>{action.description}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.suggestionsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t('home.trySaying')}
            </ThemedText>

            <View style={styles.suggestionList}>
              <View style={styles.suggestionItem}>
                <Ionicons name="mic-outline" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.suggestionText}>
                  "{t('home.scheduleMeeting')}"
                </ThemedText>
              </View>

              <View style={styles.suggestionItem}>
                <Ionicons name="mic-outline" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.suggestionText}>
                  "{t('home.showCalendar')}"
                </ThemedText>
              </View>

              <View style={styles.suggestionItem}>
                <Ionicons name="mic-outline" size={16} color={Colors.light.primary} />
                <ThemedText style={styles.suggestionText}>
                  "{t('home.addReminder')}"
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  suggestionsContainer: {
    marginBottom: 32,
  },
  suggestionList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
    fontStyle: 'italic',
  },
  // Authentication related styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  authPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderColor: '#fcc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'center',
  },
  retryButtonText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 32,
    width: '100%',
    maxWidth: 250,
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
