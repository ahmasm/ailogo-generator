import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import type { Job, JobStatus, LogoStyle } from '../types';
import { TIMEOUT } from '../constants/network';

// Validate required environment variables
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

const missingVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingVars.length > 0 && !__DEV__) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
    'Please check your .env file and ensure all Firebase config values are set.'
  );
}

if (missingVars.length > 0 && __DEV__) {
  console.warn(
    `⚠️ Missing Firebase environment variables: ${missingVars.join(', ')}\n` +
    'Firebase features will not work until you configure .env file.'
  );
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection reference
const jobsCollection = collection(db, 'jobs');

// Timeout wrapper for async operations
const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
};

// Create a new job with timeout
export async function createJob(prompt: string, style: LogoStyle): Promise<string> {
  const createPromise = addDoc(jobsCollection, {
    status: 'processing' as JobStatus,
    prompt,
    style,
    imageUrl: null,
    errorMessage: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const docRef = await withTimeout(
    createPromise,
    TIMEOUT.JOB_CREATION,
    'Job creation timed out. Please check your internet connection.'
  );

  return docRef.id;
}

// Valid job statuses
const validStatuses: JobStatus[] = ['idle', 'processing', 'done', 'failed'];

// Validate and parse job data from Firestore
function parseJobData(id: string, data: Record<string, unknown>): Job | null {
  // Validate required fields
  if (!data.status || !validStatuses.includes(data.status as JobStatus)) {
    console.error('Invalid job status:', data.status);
    return null;
  }

  if (typeof data.prompt !== 'string') {
    console.error('Invalid job prompt:', data.prompt);
    return null;
  }

  return {
    id,
    status: data.status as JobStatus,
    prompt: data.prompt,
    style: (data.style as Job['style']) ?? null,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : null,
    errorMessage: typeof data.errorMessage === 'string' ? data.errorMessage : null,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate()
      : new Date(),
  };
}

// Subscribe to job updates
export function subscribeToJob(
  jobId: string,
  onUpdate: (job: Job) => void,
  onError: (error: Error) => void
): () => void {
  const jobRef = doc(db, 'jobs', jobId);

  const unsubscribe = onSnapshot(
    jobRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const job = parseJobData(snapshot.id, data);

        if (job) {
          onUpdate(job);
        } else {
          onError(new Error('Invalid job data received from server'));
        }
      } else {
        onError(new Error('Job not found'));
      }
    },
    (error) => {
      onError(error);
    }
  );

  return unsubscribe;
}
