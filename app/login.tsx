import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ThemedView } from '../components/ThemedView';
import { ThemedText } from '../components/ThemedText';
import { Colors } from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [signInLoading, setSignInLoading] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleGoogleSignIn = async () => {
    try {
      setSignInLoading(true);
      const user = await signIn();
      if (user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            {/* Logo and Title */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="person-circle-outline" size={80} color={Colors.light.primary} />
              </View>
              <ThemedText style={styles.title}>{t('home.welcome')}</ThemedText>
              <ThemedText style={styles.subtitle}>
                {t('home.subtitle')}
              </ThemedText>
            </View>

            {/* Features */}
            <View style={styles.features}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="calendar-outline" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.featureText}>
                  <ThemedText style={styles.featureTitle}>Calendar Integration</ThemedText>
                  <ThemedText style={styles.featureDescription}>
                    Sync with Google Calendar for seamless scheduling
                  </ThemedText>
                </View>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="chatbubble-outline" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.featureText}>
                  <ThemedText style={styles.featureTitle}>AI Powered</ThemedText>
                  <ThemedText style={styles.featureDescription}>
                    Natural language processing with Google Gemini
                  </ThemedText>
                </View>
              </View>

              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.featureText}>
                  <ThemedText style={styles.featureTitle}>Task Management</ThemedText>
                  <ThemedText style={styles.featureDescription}>
                    Organize and prioritize your tasks efficiently
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Google Sign-In Button */}
            <View style={styles.signInContainer}>
              <TouchableOpacity
                style={styles.googleSignInButton}
                onPress={handleGoogleSignIn}
                disabled={signInLoading || loading}
              >
                {signInLoading || loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Image
                      source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
                      style={styles.googleLogo}
                    />
                    <Text style={styles.buttonText}>{t('auth.signInWithGoogle')}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text style={styles.disclaimerText}>
                By signing in, you agree to connect your Google Account for Calendar and AI services
              </Text>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666',
    paddingHorizontal: 20,
  },
  features: {
    marginBottom: 48,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  signInContainer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  googleSignInButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});