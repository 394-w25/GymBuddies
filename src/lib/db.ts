import { database } from "@/lib/firebase"
import { get, ref, set, update, onValue, off } from "firebase/database"
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

export const updateUserStatus = async (userId: string, status: boolean) => {
  try {
    await update(ref(database, `users/${userId}`), { status: status })
    return true
  } catch (err) {
    console.log(`failed to update user ${userId}`, err)
    return false
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
      return null
    }
  } catch (err) {
    console.log(`An error occurred while trying to get user ${userId}:`, err)
    return null
  }
}

export const addWorkout = async (userId: string, workout: WorkoutLog) => {
  const workoutId = uuidv4()

  const workoutData = {
    workoutId,
    userId: userId,
    title: workout.title,
    caption: workout.caption,
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

    return workoutId
  } catch (error) {
    console.log("Error adding workout:", error)
    return false
  }
}

export const updateWorkout = async (
  userId: string,
  workoutId: string,
  workout: WorkoutLog
) => {
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
      await set(ref(database, `workouts/${workoutId}`), workoutData)
      return true
    } catch (err) {
      console.log(`could not update finalized workout : `, err)
      return false
    }
  } else {
    try {
      await update(ref(database, `workouts/${workoutId}`), workout)

      return true
    } catch (err) {
      console.log(`could not update workout : `, err)
      return false
    }
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

export const sortWorkouts = (workouts: Workout[]) => {
  workouts.sort((a, b) => Number(b.date) - Number(a.date))
  return workouts
}

const transformWorkouts = (workoutsData: unknown): Workout[] => {
  return Object.values(workoutsData || {}).map((workout) => {
    const typedWorkout = workout as Workout

    if (typedWorkout.date) typedWorkout.date = new Date(typedWorkout.date)
    if (typedWorkout.startTime)
      typedWorkout.startTime = new Date(typedWorkout.startTime)
    if (typedWorkout.endTime)
      typedWorkout.endTime = new Date(typedWorkout.endTime)

    return typedWorkout
  })
}

export const listenToWorkouts = (callback: (workouts: Workout[]) => void) => {
  const workoutsRef = ref(database, "workouts")

  const listener = onValue(workoutsRef, (snapshot) => {
    if (snapshot.exists()) {
      const workouts = transformWorkouts(snapshot.val())
      callback(sortWorkouts(workouts))
    } else {
      callback([])
    }
  })

  // Return unsubscribe function
  return () => off(workoutsRef, "value", listener)
}

export const getAllWorkouts = async (): Promise<Workout[]> => {
  try {
    const workoutsRef = ref(database, `workouts`)
    const snapshot = await get(workoutsRef)

    if (snapshot.exists()) {
      const workouts = transformWorkouts(snapshot.val())
      return sortWorkouts(workouts)
    } else {
      console.log(`No workouts found in the database.`)
      return []
    }
  } catch (err) {
    console.error(`An error occurred while fetching all workouts:`, err)
    return []
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

    return sortWorkouts(validWorkouts)
  } catch (error) {
    console.error(
      `An error occurred while fetching workouts for user ${userId}:`,
      error
    )
    return null
  }
}

export const addFriend = async (userId: string, friendId: string) => {
  //add friend's id to user friend list
  get(ref(database, `users/${userId}`))
    .then((data) => {
      if (!data.exists()) {
        // no data, no pass
        throw new Error("Failed to fetch user from database :(")
      }
      const currUser = data.val()
      update(ref(database, `users/${userId}`), {
        friends:
          currUser.friends !== undefined
            ? [...currUser.friends, friendId]
            : [friendId],
      })
    })
    .catch((err) => {
      console.log(`error ocurred while trying to look up user ${userId}`, err)
      return false
    })

  // right now just force both people to be friends

  get(ref(database, `users/${friendId}`))
    .then((data) => {
      if (!data.exists()) {
        throw new Error("Failed to fetch friend from db :(")
      } else {
        const currFriend = data.val()
        update(ref(database, `users/${friendId}`), {
          friends:
            currFriend.friends !== undefined
              ? [...currFriend.friends, userId]
              : [userId],
        })
      }
    })
    .catch((err) => {
      console.log(
        `Could not complete friend add, likely could not find friend with friend id ${friendId}`,
        err
      )
      return false
    })

  console.log(`successfully linked friends ${userId} and ${friendId}`)
  return true
}
