'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db, syncUserProfile, handleFirestoreError, OperationType, testConnection } from '@/lib/firebase';
import { UserProfile } from '@/lib/types';

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  firestoreConnected: boolean;
  signInWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  profile: null,
  loading: true,
  firestoreConnected: false,
  signInWithGoogle: async () => null,
  logout: async () => {},
  refreshProfile: async () => {},
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  useEffect(() => {
    // Validate connection once mounted
    testConnection().then((connected) => {
      setFirestoreConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userProf = await syncUserProfile(fbUser);
          setProfile(userProf);
          // Also sync into local server session for SSR/API parity
          await fetch('/api/auth/me', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'switch_firebase', firebaseUser: fbUser, profile: userProf }),
          });
        } catch (e) {
          console.error('Failed to sync Firebase user:', e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const userProf = await syncUserProfile(res.user);
        setUser(res.user);
        setProfile(userProf);
        await fetch('/api/auth/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'switch_firebase', firebaseUser: res.user, profile: userProf }),
        });
        return userProf;
      }
      return null;
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      // Switch back to student demo on local server session
      await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', userId: 'user-student-hsc' }),
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProf = await syncUserProfile(user);
      setProfile(userProf);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        loading,
        firestoreConnected,
        signInWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
