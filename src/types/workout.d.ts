export interface Set {
  number: number
  weight: number
  reps: number
}

export interface Exercise {
  name: string
  sets: Set[]
}

export interface WorkoutLog {
  date: Date
  startTime: Date
  endTime: Date
  exercises: [Exercise, ...Exercise[]]
}
