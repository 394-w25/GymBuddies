import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

export interface User {
  user_id: string
  name: string
  profile_pic: string
  email: string
  friends: string[]
  status: number
  bio: string
  streak: number
  workouts: string[] // Array of Workout IDs
}

export interface Workout {
  user_id: string
  workout_id: string
  start_time: string
  end_time: string
  exercises: {
    exercise_name: string
    num_sets: number
    num_reps: number
    weight: number
  }[]
}

console.log(import.meta.env.VITE_FIREBASE_DATABASE_URL)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

console.log(`firebase Config, `, firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database
export const database = getDatabase(app)
