# AI Logo Generator - FERASET Case Study

A demo mobile application simulating "Hexa – AI Logo & Art Generator" built with React Native Expo.

## Demo Video

[Watch the demo](https://youtube.com/shorts/zo2Vv7yVxj8)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native Expo (Managed Workflow) |
| Navigation | React Navigation (Native Stack) |
| State Management | Zustand |
| Database | Firebase Firestore |
| Backend | Firebase Cloud Functions (Python) |
| Storage | Cloudflare R2 (S3 compatible) |
| CI/CD | GitHub Actions |

## Project Structure

```
feraset/
├── app/                          # React Native Expo app
│   ├── src/
│   │   ├── screens/              # InputScreen, OutputScreen
│   │   ├── components/           # Reusable UI components
│   │   ├── store/                # Zustand state management
│   │   ├── services/             # Firebase configuration
│   │   ├── hooks/                # Custom hooks (useJobListener)
│   │   ├── constants/            # Theme, colors, fonts
│   │   ├── types/                # TypeScript definitions
│   │   └── navigation/           # React Navigation setup
│   └── App.tsx
├── functions/                    # Firebase Cloud Functions
│   ├── main.py                   # Job processing function
│   └── requirements.txt
├── .github/workflows/            # CI/CD pipeline
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
└── firestore.indexes.json
```

## Features

- **Input Screen**: Enter prompt, select logo style, create job
- **Status Chip**: Real-time status updates (Processing → Done/Failed)
- **Output Screen**: View generated logo with prompt details
- **Mock Generation**: 30-60 second delay, 90% success rate

## Prerequisites

- Node.js 20+
- Python 3.12+
- Expo CLI (`npm install -g expo-cli`)
- Firebase CLI (`npm install -g firebase-tools`)

## Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd feraset

# Install app dependencies
cd app
npm install

# Install function dependencies
cd ../functions
pip install -r requirements.txt
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get your Firebase config from Project Settings > Your apps > Web app
4. Copy `app/.env.example` to `app/.env` and fill in values:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Cloudflare R2 Setup

1. Create an R2 bucket at [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Enable public access for the bucket
3. Create an API token with R2 read/write permissions
4. Copy `functions/.env.example` to `functions/.env` and fill in values:

```env
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### 4. Deploy Firebase

```bash
# Login to Firebase
firebase login

# Deploy Firestore rules and Cloud Functions
firebase deploy
```

## Running the App

```bash
cd app

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Running Tests

### TypeScript Check

```bash
cd app
npx tsc --noEmit
```

## Architecture

### Data Flow

```
User Input → Firestore (create job) → Cloud Function triggered
                                            ↓
                                    Mock processing (30-60s)
                                            ↓
                                    Upload to R2 (90% success)
                                            ↓
User ← StatusChip updates ← Firestore (realtime listener) ← Update status
```

### Firestore Schema

```typescript
interface Job {
  id: string
  status: 'idle' | 'processing' | 'done' | 'failed'
  prompt: string
  style: 'no-style' | 'monogram' | 'abstract' | 'mascot' | null
  imageUrl: string | null
  errorMessage: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| React Navigation | Industry standard, familiar to most RN developers |
| Zustand | Lightweight, simple API, no boilerplate |
| Cloudflare R2 | S3-compatible, no vendor lock-in, generous free tier |
| Python Cloud Functions | Required by case study spec |
| No Authentication | Simplified scope for demo purposes |
| Public R2 Bucket | Acceptable for demo, would use signed URLs in production |

## Assumptions

1. **Mock Images**: Using placeholder images (picsum.photos) or pre-uploaded logos
2. **No Auth**: Users don't need to sign in for this demo
3. **Single Job**: One active job at a time per session
4. **Processing Time**: Fixed 30-60 second random delay as specified
5. **Success Rate**: 90% success, 10% failure as specified

## Known Limitations

- No persistent job history (jobs are session-based)
- No image caching strategy implemented
- No offline support
- No push notifications for job completion
