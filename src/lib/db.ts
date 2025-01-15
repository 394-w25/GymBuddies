import { database } from "@/lib/firebase"
import { get, ref, set, update } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import type { User as FirebaseUser } from "firebase/auth"
import type { Workout, WorkoutLog } from "@/types/workout"

export const addUser = async (user: FirebaseUser) => {
  const { uid, photoURL, displayName, email } = user

  const userData: User = {
    userId: uid,
    name: displayName || "",
    email: email || "",
    profilePic: photoURL || "",
    friends: [],
    status: "",
    bio: "",
    streak: 0,
    workouts: [],
  }

  try {
    await set(ref(database, `users/${uid}`), userData)
    console.log(`User added! ${uid}`)
    return true
  } catch (error) {
    console.log("Error creating user:", error)
    return false
  }
}

export const addWorkout = async (userId: string, workout: WorkoutLog) => {
  const workoutId = uuidv4()

  const workoutData = {
    workoutId,
    userId: userId,
    title: workout.title || "",
    caption: workout.caption || "",
    date: workout.date.getTime(),
    startTime: workout.startTime.getTime(),
    endTime: workout.endTime.getTime(),
    exercises: workout.exercises,
  }

  try {
    await set(ref(database, `workouts/${workoutId}`), workoutData)

    // Update workouts array for user
    const userRef = ref(database, `users/${userId}/workouts`)
    const userWorkoutsSnapshot = await get(userRef)
    const userWorkouts = userWorkoutsSnapshot.exists()
      ? [...userWorkoutsSnapshot.val(), workoutId]
      : [workoutId]

    await update(ref(database, `users/${userId}`), { workouts: userWorkouts })

    console.log(`Workout ${workoutId} added for user ${userId}`)

    return true
  } catch (error) {
    console.log("Error adding workout:", error)
    return false
  }
}

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userRef = ref(database, `users/${userId}`)
    const snapshot = await get(userRef)

    if (snapshot.exists()) {
      return snapshot.val() as User
    } else {
      console.log(`Could not find user with id ${userId}`)
      return null
    }
  } catch (err) {
    console.log(`An error occurred while trying to get user ${userId}:`, err)
    return null
  }
}

export const getWorkout = async (workoutId: string) => {
  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)
    const snapshot = await get(workoutRef)

    if (snapshot.exists()) {
      const workoutData = snapshot.val()
      if (workoutData) {
        if (workoutData.date) workoutData.date = new Date(workoutData.date)
        if (workoutData.startTime)
          workoutData.startTime = new Date(workoutData.startTime)
        if (workoutData.endTime)
          workoutData.endTime = new Date(workoutData.endTime)
      }
      return workoutData as Workout
    } else {
      console.log(`Could not find workout with id ${workoutId}`)
      return {}
    }
  } catch (err) {
    console.log(
      `An error occurred while trying to get workout ${workoutId}:`,
      err
    )
    return {}
  }
}

export const getAllUserWorkouts = async (
  userId: string
): Promise<Workout[] | null> => {
  try {
    const user = await getUser(userId)
    if (!user) {
      console.error(`User with id ${userId} does not exist.`)
      return null
    }

    const workoutIds = user.workouts || []
    if (workoutIds.length === 0) {
      console.log(`No workouts found for user ${userId}.`)
      return []
    }

    const workoutPromises = workoutIds.map((workoutId) => getWorkout(workoutId))
    const workouts = await Promise.all(workoutPromises)

    const validWorkouts = workouts.filter(
      (workout): workout is Workout =>
        workout && Object.keys(workout).length > 0
    )

    return validWorkouts
  } catch (error) {
    console.error(
      `An error occurred while fetching workouts for user ${userId}:`,
      error
    )
    return null
  }
}

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const workoutsRef = ref(database, `workouts`)
    const snapshot = await get(workoutsRef)

    if (snapshot.exists()) {
      const workoutsData = snapshot.val()

      // Transform the workouts object into an array and convert timestamps
      const workouts: Workout[] = Object.values(workoutsData).map((workout) => {
        const typedWorkout = workout as Workout

        if (typedWorkout.date) typedWorkout.date = new Date(typedWorkout.date)
        if (typedWorkout.startTime)
          typedWorkout.startTime = new Date(typedWorkout.startTime)
        if (typedWorkout.endTime)
          typedWorkout.endTime = new Date(typedWorkout.endTime)

        return typedWorkout
      })

      return workouts
    } else {
      console.log(`No workouts found in the database.`)
      return []
    }
  } catch (err) {
    console.error(`An error occurred while fetching all workouts:`, err)
    return []
  }
}
