import { database } from "@/lib/firebase"
import { get, ref, set, update } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import type { Workout, WorkoutLog } from "@/types/workout"

export const addUser = async (
  name: string,
  email: string,
  profilePic: string
) => {
  const userId = uuidv4()

  const userData: User = {
    userId,
    name: name,
    profilePic: profilePic,
    email: email,
    friends: [],
    status: "",
    bio: "",
    streak: 0,
    workouts: [],
  }

  await set(ref(database, `users/${userId}`), userData)

  console.log(`User added! ${userId}`)
}

export const addWorkout = async (userId: string, workout: WorkoutLog) => {
  const workoutId = uuidv4()

  const workoutData: Workout = {
    workoutId,
    userId: userId,
    title: workout.title,
    caption: workout.caption,
    date: workout.date,
    startTime: workout.startTime,
    endTime: workout.endTime,
    exercises: workout.exercises,
  }

  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)

    await set(workoutRef, workoutData)

    // Update workouts array for user
    const userRef = ref(database, `users/${userId}/workouts`)
    const userWorkoutsSnapshot = await get(userRef)
    const userWorkouts = userWorkoutsSnapshot.exists()
      ? [...userWorkoutsSnapshot.val(), workoutId]
      : [workoutId]

    await update(ref(database, `users/${userId}`), { workouts: userWorkouts })

    console.log(`Workout ${workoutId} added for user ${userId}`)
  } catch (error) {
    console.log("Error adding workout:", error)
  }
}

export const getUser = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      return snapshot.val() as User
    } else {
      console.log(`Could not find user with id ${userId}`)
      return {}
    }
  } catch (err) {
    console.log(`An error occurred while trying to get user ${userId}`, err)
    return {}
  }
}

export const getWorkout = async (workoutId: string) => {
  try {
    const workoutRef = ref(database, `users/${workoutId}`)
    const snapshot = await get(workoutRef)

    if (snapshot.exists()) {
      const workoutData = snapshot.val()
      return workoutData as Workout
    } else {
      console.log(`Could not find workout with id ${workoutId}`)
      return {}
    }
  } catch (err) {
    console.log(
      `An error occurred while trying to get workout ${workoutId}`,
      err
    )
    return {}
  }
}
