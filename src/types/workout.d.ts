export interface Set {
  number: number
  weight: number
  reps: number
}

export interface Exercise {
  name: string
  sets: Set[]
}

export interface Comment {
  uid: string
  comment: string
}

// Todo: Get rid of date
export interface WorkoutLog {
  title: string
  caption: string
  date: Date
  startTime: Date
  endTime: Date
  exercises: Exercise[]
}

export interface Workout extends WorkoutLog {
  workoutId: string
  userId: string
  likes: string[]
  comments: Comment[]
}
