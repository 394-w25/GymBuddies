import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Exercise } from "@/types/workout"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateMinutesBetweenDates = (
  date1: Date,
  date2: Date
): number => {
  const timeDifference = Math.abs(date2.getTime() - date1.getTime())
  const minutesDifference = Math.floor(timeDifference / (1000 * 60))

  return minutesDifference
}

export const calculateWorkoutVolume = (workout: Exercise[]): number => {
  const totalVolume = workout.reduce((volume, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setVolume, set) => {
      return setVolume + set.reps * set.weight
    }, 0)

    return volume + exerciseVolume
  }, 0)

  return totalVolume
}

export const getBestSet = (exercise: Exercise): string => {
  if (!exercise.sets || exercise.sets.length === 0) {
    console.error("The exercise has no sets.")
    return "---"
  }

  // Find the set with the maximum volume
  const maxSet = exercise.sets.reduce((max, set) => {
    const maxVolume = max.reps * max.weight
    const setVolume = set.reps * set.weight
    return setVolume > maxVolume ? set : max
  })

  return `${maxSet.weight} lbs x ${maxSet.reps}`
}
