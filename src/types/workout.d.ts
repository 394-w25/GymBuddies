export interface Set {
  number: number
  weight: number
  reps: number
}

export interface Exercise {
  name: string
  sets: Array<ExerciseSet>
}

export interface WorkoutLog {
  date: Date
  startTime: Date
  endTime: Date
  exercises: Exercise[]
}
