import { database } from "@/lib/firebase"
import { get, ref, set, update, onValue, off } from "firebase/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/types/user"
import type { User as FirebaseUser } from "firebase/auth"
import type { Workout, WorkoutLog } from "@/types/workout"

// User Functions
export const addUser = async (user: FirebaseUser) => {
  const { uid, photoURL, email, displayName } = user

  const userData: User = {
    userId: uid,
    name: displayName || "",
    email: email || "",
    profilePic: photoURL || "",
    status: false,
    bio: "",
    streak: 0,
    workouts: [],
    following: [],
    followers: [],
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

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const dbSnapshot = await get(ref(database, "users"))
    if (!dbSnapshot.exists()) {
      throw new Error(
        "Database snapshot didn't exist... database could not be reached?"
      )
    }

    const usersData = dbSnapshot.val() // users object like { userId : {userData}, ...}

    return usersData as User[]
  } catch (err) {
    console.log(`ERROR occurred when trying to fetch all users : `, err)
    return []
  }
}

// Workout Functions
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

    return workoutId
  } catch (error) {
    console.log("Error adding workout:", error)
    return false
  }
}

// NOTE: This function does not work (but we're not currently using it)
export const updateWorkout = async (
  userId: string,
  workoutId: string,
  workout: WorkoutLog
) => {
  if (workout.endTime) {
    const workoutData = {
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
      throw new Error("Could not find workout with this ID.")
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
    const user = (await getUser(userId)) as User
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

export const likeWorkout = async (
  workoutId: string,
  reactorId: string
): Promise<boolean> => {
  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)

    const snapshot = await get(workoutRef)
    if (!snapshot.exists()) {
      throw new Error("Workout does not exist!")
    }

    const workoutData = snapshot.val() as Workout
    const newLikes =
      workoutData.likes != undefined
        ? [...workoutData.likes.filter((uid) => uid !== reactorId), reactorId]
        : [reactorId]

    await update(workoutRef, {
      likes: newLikes,
    })

    return true
  } catch (err) {
    console.log("Error liking workout:", err)
    return false
  }
}

export const unlikeWorkout = async (
  workoutId: string,
  reactorId: string
): Promise<boolean> => {
  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)

    const snapshot = await get(workoutRef)
    if (!snapshot.exists()) {
      throw new Error("Workout does not exist!")
    }

    const workoutData = snapshot.val() as Workout
    const likes = workoutData.likes

    if (likes.includes(reactorId)) {
      await update(workoutRef, {
        likes: likes.filter((uid) => uid !== reactorId),
      })
    }

    return true
  } catch (err) {
    console.log("Error liking workout:", err)
    return false
  }
}

export const listenToWorkoutLikes = (
  workoutId: string,
  callback: (likes: string[]) => void
) => {
  const likesRef = ref(database, `workouts/${workoutId}/likes`)

  const listener = onValue(likesRef, (snapshot) => {
    if (snapshot.exists()) {
      const likes = snapshot.val()
      callback(likes)
    } else {
      callback([])
    }
  })

  // Return unsubscribe function
  return () => off(likesRef, "value", listener)
}

export const commentOnWorkout = async (
  workoutId: string,
  commenterId: string,
  comment: string
) => {
  try {
    const workoutRef = ref(database, `workouts/${workoutId}`)

    const snapshot = await get(workoutRef)
    if (!snapshot.exists()) {
      throw new Error("Workout does not exist!")
    }

    const workoutData = snapshot.val() as Workout
    const newComments =
      workoutData.comments != undefined
        ? [...workoutData.comments, { uid: commenterId, comment: comment }]
        : [{ uid: commenterId, comment: comment }]

    await update(workoutRef, {
      comments: newComments,
    })

    return true
  } catch (err) {
    console.log("Error commenting on workout:", err)
    return false
  }
}

// Follow Functions
export const followUser = async (
  followerId: string,
  followedId: string
): Promise<boolean> => {
  try {
    // Helper function to normalize data into an array
    const normalizeToArray = (data: unknown): string[] => {
      if (data === undefined || data === null) {
        return []
      }
      if (typeof data === "object" && !Array.isArray(data)) {
        // If data is an object (Firebase-style "array"), convert it to an array
        return Object.values(data)
      }
      // If data is already an array, return it as-is
      return Array.isArray(data) ? data : [data]
    }

    // add followed user to follower's following list
    const followerData = await get(ref(database, `users/${followerId}`))
    if (!followerData.exists()) {
      throw new Error("Failed to get data about user trying to follow.")
    }

    const followerUser = followerData.val()
    const updatedFollowing = normalizeToArray(followerUser.following)
    if (!updatedFollowing.includes(followedId)) {
      updatedFollowing.push(followedId)
    }

    // add follower to followed user's follower list
    const followedData = await get(ref(database, `users/${followedId}`))
    if (!followedData.exists()) {
      throw new Error("Failed to get data about user being followed.")
    }

    const followedUser = followedData.val()
    const updatedFollowers = normalizeToArray(followedUser.followers)
    if (!updatedFollowers.includes(followerId)) {
      updatedFollowers.push(followerId)
    }

    // Batch update to prevent data corruption
    const updates: {
      [key: string]: unknown
    } = {}
    updates[`users/${followerId}/following`] = updatedFollowing
    updates[`users/${followedId}/followers`] = updatedFollowers

    await update(ref(database), updates)

    return true
  } catch (err) {
    console.log("Error occurred during follow:", err)
    return false
  }
}

export const listenToFollowingChanged = (
  userId: string,
  callback: (following: string[]) => void
) => {
  const followingRef = ref(database, `users/${userId}/following`)

  const listener = onValue(followingRef, (snapshot) => {
    if (snapshot.exists()) {
      const following = snapshot.val()
      callback(following)
    } else {
      callback([])
    }
  })

  // Return unsubscribe function
  return () => off(followingRef, "value", listener)
}

export const getFollowersOfUser = async (
  userId: string
): Promise<string[] | undefined> => {
  try {
    const data = await get(ref(database, `users/${userId}`))
    if (!data.exists()) {
      throw new Error(`Couldn't fetch data for user with userId ${userId}`)
    }

    const userData = data.val()
    if (!userData) {
      throw new Error(`User ${userId} has no data in the system....`)
    }

    const user = userData as User
    if (user.followers !== undefined) {
      return user.followers
    }

    return []
  } catch (err) {
    console.log("ERROR ocurred when getting followers -- ", err)
    return []
  }
}

export const getFollowingOfUser = async (
  userId: string
): Promise<string[] | undefined> => {
  try {
    const data = await get(ref(database, `users/${userId}`))

    if (!data.exists()) {
      throw new Error(`Couldn't fetch data for user with userId ${userId}`)
    }

    const userData = data.val()
    if (!userData) {
      throw new Error(`User ${userId} has no data in the system....`)
    }

    const user = userData as User

    if (user.following !== undefined) {
      return user.following
    }

    return []
  } catch (err) {
    console.log("ERROR ocurred when getting following -- ", err)
    return []
  }
}
