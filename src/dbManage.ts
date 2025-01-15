import { database, User, Workout } from "./firebase"; // Your Firebase config file
import { get, ref, set, update } from "firebase/database";
import {v4 as uuidv4 } from 'uuid';
// import * as internal from "stream";

export interface Exercise {
  exercise_name : string;
  num_sets : number;
  num_reps : number;
  weight : number;
}


// Add a user

export const addUser = async (name : string, profile_pic : string, email : string, friends_list : string[], status : number, bio : string, streak : number, workouts_list : string[]) => {

  const userId = uuidv4(); // generate new user id
  console.log(`new user id! : ${userId}`)

  await set(ref(database, `users/${userId}`), {
    name: name,
    profile_pic: profile_pic,
    email: email,
    friends: friends_list,
    status: status, // 0 == acrively working out, 1 === at rest?
    bio: bio,
    streak: streak,
    workouts: workouts_list,
  });

  console.log(`User added! ${userId}`);
};

// Add a workout
// yea times are strings rn, maybe we change that maybe we don't
export const addWorkout = async ( userId : string, startTime : string, endTime : string, exerciseList : Exercise[]) => {

  const workout_id = uuidv4(); // generate new workout id
  console.log("New workout @ ", workout_id);

  const workoutData = {
    user_id : userId,
    start_time : startTime,
    end_time : endTime,
    exercises : exerciseList,

  }

  try {
    const workoutRef = ref(database, `workouts/${workout_id}`);

    await set(workoutRef, workoutData);

    // get current workouts array for user
    const userRef = ref(database, `users/${userId}/workouts`);
    const userWorkoutsSnapshot = await get(userRef);
    let userWorkouts = userWorkoutsSnapshot.exists() ? [...userWorkoutsSnapshot.val(), workout_id] : [workout_id];

    await update(ref(database, `users/${userId}`), {workouts : userWorkouts});

    console.log(`Workout ${workout_id} added for user ${userId}`);
  } catch (error) {
    console.log("Error in add workout process : ", error);
  }

};

export const readUser = async (userId : string) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      console.log(JSON.stringify(snapshot.val()));
      return snapshot.val() as User;
    } else {
      console.log(`could not find user with id ${userId}`);
      return {};
    }

  } catch (err) {
    console.log("An error occurred while trying to read user", err);
    return {};
  }
}

export const readWorkout = async (workoutId : string) => {
  try {
    const workoutRef = ref(database, `users/${workoutId}`);
    const snapshot = await get(workoutRef);

    if (snapshot.exists()) {
      return snapshot.val() as Workout;

    } else {
      console.log(`workout ${workoutId} doesn't exist`);
      return {};
    }

  } catch (err) {
    console.log(`an error ocurred while trying to lookup workout ${workoutId}`, err);
    return {};
  }
}