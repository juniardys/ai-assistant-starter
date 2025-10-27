import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfileHeader } from '@/components/ProfileHeader';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

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
});
