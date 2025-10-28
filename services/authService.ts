import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../config/firebase';
import { Alert } from 'react-native';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  idToken?: string;
  accessToken?: string;
}

class AuthService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
        offlineAccess: true,
      });
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      throw error;
    }
  }

  async signIn(): Promise<AuthUser | null> {
    try {
      await this.initialize();

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);

      // Sign in to Firebase with Google credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseUser = userCredential.user;

      // Store tokens securely
      if (userInfo.idToken && userInfo.accessToken) {
        await SecureStore.setItemAsync('google_id_token', userInfo.idToken);
        await SecureStore.setItemAsync('google_access_token', userInfo.accessToken);
      }

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        idToken: userInfo.idToken,
        accessToken: userInfo.accessToken,
      };

      return authUser;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', 'Another sign-in operation is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', 'Google Play Services is not available on your device.');
      } else {
        Alert.alert('Sign-In Error', 'An error occurred during sign-in. Please try again.');
      }

      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);

      // Clear stored tokens
      await SecureStore.deleteItemAsync('google_id_token');
      await SecureStore.deleteItemAsync('google_access_token');
    } catch (error) {
      console.error('Sign-Out Error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        return null;
      }

      // Get stored tokens
      const idToken = await SecureStore.getItemAsync('google_id_token');
      const accessToken = await SecureStore.getItemAsync('google_access_token');

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        idToken: idToken || undefined,
        accessToken: accessToken || undefined,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getStoredTokens(): Promise<{ idToken: string | null; accessToken: string | null }> {
    try {
      const idToken = await SecureStore.getItemAsync('google_id_token');
      const accessToken = await SecureStore.getItemAsync('google_access_token');

      return { idToken, accessToken };
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      return { idToken: null, accessToken: null };
    }
  }

  async refreshTokens(): Promise<{ idToken: string | null; accessToken: string | null }> {
    try {
      await this.initialize();

      const userInfo = await GoogleSignin.signInSilently();

      if (userInfo.idToken && userInfo.accessToken) {
        await SecureStore.setItemAsync('google_id_token', userInfo.idToken);
        await SecureStore.setItemAsync('google_access_token', userInfo.accessToken);
      }

      return {
        idToken: userInfo.idToken,
        accessToken: userInfo.accessToken,
      };
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return { idToken: null, accessToken: null };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Setup auth state listener
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new AuthService();