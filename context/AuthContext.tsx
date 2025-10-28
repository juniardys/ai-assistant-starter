import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import authService, { AuthUser } from '../services/authService';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get stored tokens
        const tokens = await authService.getStoredTokens();
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          idToken: tokens.idToken || undefined,
          accessToken: tokens.accessToken || undefined,
        };
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const signIn = async (): Promise<AuthUser | null> => {
    try {
      setLoading(true);
      setError(null);
      const authUser = await authService.signIn();
      if (authUser) {
        setUser(authUser);
      }
      return authUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign-in';
      setError(errorMessage);
      console.error('Sign in error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during sign-out';
      setError(errorMessage);
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};