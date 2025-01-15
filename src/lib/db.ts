import { database } from "@/lib/firebase"
import { get, ref, set, update } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import type { User as FirebaseUser } from "firebase/auth"
import type { Workout, WorkoutLog } from "@/types/workout"

export const addUser = async (user: FirebaseUser) => {
  const { uid, photoURL, displayName } = user

  const userData: User = {
    userId: uid,
    name: displayName || "",
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

export const updateUserStatus = async (userId : string, status: boolean) => {
    try {
      await update(ref(database, `users/${userId}`), {status : status});
      return true;
    } catch (err) {
      console.log(`failed to update user ${userId}`, err);
      return false;
    }
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
    await set(ref(database, `workouts/${workoutId}`), workoutData)

    // Update workouts array for user
    const userRef = ref(database, `users/${userId}/workouts`)
    const userWorkoutsSnapshot = await get(userRef)
    const userWorkouts = userWorkoutsSnapshot.exists()
      ? [...userWorkoutsSnapshot.val(), workoutId]
      : [workoutId]

    await update(ref(database, `users/${userId}`), { workouts: userWorkouts })

    console.log(`Workout ${workoutId} added for user ${userId}`)

    return workoutId;
  } catch (error) {
    console.log("Error adding workout:", error)
    return false
  }
}

export const updateWorkout = async (userId : string, workoutId : string, workout : WorkoutLog) => {


  if (workout.endTime) {
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
      await set(ref(database, `workouts/${workoutId}`), workoutData);
      return true;

    } catch (err) {
      console.log(`could not update finalized workout : `, err);
      return false;
    }

  } else {
    try {
      await update(ref(database, `workouts/${workoutId}`), workout);
      return true;

    } catch (err) {
      console.log(`could not update workout : `, err);
      return false;
    }
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
    console.log(`An error occurred while trying to get user ${userId}:`, err)
    return {}
  }
}

export const getWorkout = async (workoutId: string) => {
  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)
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
      `An error occurred while trying to get workout ${workoutId}:`,
      err
    )
    return {}
  }
}

