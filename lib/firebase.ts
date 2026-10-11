import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile } from './types';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Database with specific Database ID (Enterprise/Developer instance)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Operation types for strict Firestore error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test according to the skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network restricted.');
      return false;
    }
    // Connected or permission response is normal for test doc
    return true;
  }
}

// Sync Firebase User profile to Firestore
export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const existing = snap.data() as UserProfile;
      return existing;
    } else {
      const isAdmin = user.email === 'disharistudy@gmail.com';
      const newProfile: UserProfile = {
        id: user.uid,
        email: user.email || '',
        full_name: user.displayName || 'দিশারী শিক্ষার্থী',
        academic_level: 'hsc',
        avatar_url: user.photoURL || undefined,
        role: isAdmin ? 'admin' : 'student',
        created_at: now,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err) {
    console.error('Error syncing user profile:', err);
    // Return standard profile object fallback
    return {
      id: user.uid,
      email: user.email || '',
      full_name: user.displayName || 'দিশারী শিক্ষার্থী',
      academic_level: 'hsc',
      role: user.email === 'disharistudy@gmail.com' ? 'admin' : 'student',
      created_at: now,
    };
  }
}
