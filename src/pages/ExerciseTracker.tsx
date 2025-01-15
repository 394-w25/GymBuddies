import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/LogModal"
import type { WorkoutLog } from "@/types/workout"
import { addUser, addWorkout, readUser } from "@/dbManage"

/**
 * 
 * export interface User {
  user_id: string;
  name: string;
  profile_pic: string;
  email: string;
  friends: string[];
  status: number;
  bio: string;
  streak: number;
  workouts: string[]; // Array of Workout IDs
}
 */

const ExerciseTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSaveWorkout = (workout: WorkoutLog) => {
    // Remember to zero out seconds
    console.log(workout)
  }

  const dummyUser = {
    name : 'Theo Maurino',
    profile_pic : "/images/theo.png",
    email : "thjmaurino@gmail.com",
    friends : [],
    status : 1,
    bio : "My name is Theo, and I love to hit the gym!",
    streak : 999999,
    workouts : []

  }

  const dummyWorkout = [
    {
      exercise_name: "Bench Press",
      num_sets: 3,
      num_reps: 10,
      weight: 185,
    },
    {
      exercise_name: "Pull-Ups",
      num_sets: 3,
      num_reps: 8,
      weight: 0,
    },
    {
      exercise_name: "Deadlift",
      num_sets: 4,
      num_reps: 5,
      weight: 225,
    },
    {
      exercise_name: "Squats",
      num_sets: 4,
      num_reps: 12,
      weight: 155,
    },
    {
      exercise_name: "Lunges",
      num_sets: 3,
      num_reps: 10,
      weight: 50,
    },
    {
      exercise_name: "Overhead Press",
      num_sets: 3,
      num_reps: 8,
      weight: 95,
    },
    {
      exercise_name: "Barbell Row",
      num_sets: 3,
      num_reps: 10,
      weight: 135,
    },
    {
      exercise_name: "Bicep Curls",
      num_sets: 3,
      num_reps: 12,
      weight: 25,
    },
    {
      exercise_name: "Tricep Dips",
      num_sets: 3,
      num_reps: 15,
      weight: 0,
    },
    {
      exercise_name: "Leg Press",
      num_sets: 5,
      num_reps: 15,
      weight: 200,
    },
  ];

  const addTheo = () => {
    addUser(dummyUser.name, dummyUser.profile_pic, dummyUser.email, dummyUser.friends, dummyUser.status, dummyUser.bio, dummyUser.streak, dummyUser.workouts);
  }

  const addTheoWorkout = () => {
    addWorkout('cad47c30-f0b7-49cb-bbc5-dedb7232f210', Date(), Date(), dummyWorkout);
  }

  readUser('cad47c30-f0b7-49cb-bbc5-dedb7232f210');

  return (
    <div className="container mx-auto">
      <h1 className="text-6xl font-bold mb-6">Tracker</h1>
      <Button
        size="lg"
        className="w-full mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        + Log Workout
      </Button>

      <WorkoutLogModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveWorkout}
      />

      <div className="button-container bg-gray-300" onClick={addTheo}>
        CLICK ME
      </div>

      <div className="button-container mt-10 bg-gray-300" onClick={addTheoWorkout}>
        CLICK ME TO ADD WORKOUT FOR THEO
      </div>
    </div>
  )
}

export default ExerciseTracker
