import { useEffect, useState } from "react"
import {
  addWorkout,
  getAllUserWorkouts,
  sortWorkouts,
  deleteWorkout,
} from "@/lib/db"
import { useUser } from "@/components/Layout/UserContext"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/WorkoutInput"
import WorkoutCard from "@/components/common/WorkoutCard"
import type { Workout, WorkoutLog } from "@/types/workout"
import { calculateWorkoutVolume } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const ExerciseTracker = () => {
  const { user, handleSignIn } = useUser()
  const { toast } = useToast()

  const [userWorkouts, setUserWorkouts] = useState<Workout[] | null>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      if (!user) return

      const res = await getAllUserWorkouts(user.userId)
      if (res) {
        setUserWorkouts(sortWorkouts(res))
      }
    }

    fetchUserWorkouts()
  }, [user])

  const handleSaveWorkout = async (workout: WorkoutLog): Promise<boolean> => {
    if (!user) return false

    let error = [false, ""]

    const workoutDuration =
      workout.endTime.getTime() - workout.startTime.getTime()
    if (!(workoutDuration > 0))
      error = [
        true,
        "Your workout has to be at least 1 minute long. Please check your start and end times!",
      ]

    const workoutVolume = calculateWorkoutVolume(workout.exercises)
    if (!(workoutVolume > 0))
      error = [true, "Please add weight and reps to your exercises!"]

    if (workout.exercises.length == 0)
      error = [
        true,
        "You need at least one exercise (with a name) in this workout!",
      ]

    if (error[0]) {
      toast({
        variant: "destructive",
        title: "Something's not right...",
        description: error[1] || "There's a problem with your workout.",
      })
      return false
    }

    const res = await addWorkout(user.userId, workout)
    if (res !== false && userWorkouts !== null) {
      const newWorkouts: Workout[] = [
        ...userWorkouts,
        {
          ...workout,
          userId: user.userId,
          workoutId: res,
          likes: [],
          comments: [],
        },
      ]
      setUserWorkouts(sortWorkouts(newWorkouts))
    }

    return true
  }

  const handleDelete = async (workoutId: string) => {
    const success = await deleteWorkout(workoutId)
    if (success && userWorkouts !== null) {
      setUserWorkouts(
        userWorkouts.filter((workout) => workout.workoutId !== workoutId)
      )
    }
  }

  return (
    <>
      {user && (
        <div className="container mx-auto">
          <Button
            size="lg"
            className="w-full mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Workout
          </Button>

          <WorkoutLogModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            onSave={handleSaveWorkout}
          />

          {user && (
            <div className="flex flex-col gap-4">
              {userWorkouts?.map((workout, key) => (
                <WorkoutCard
                  key={key}
                  userId={workout.userId}
                  workout={workout}
                  username={user.name}
                  profilePic={user.profilePic}
                  displayProfile={false}
                  displayComments={false}
                  displayDelete={true}
                  onDelete={() => handleDelete(workout.workoutId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="empty-following-message flex flex-col items-center justify-center mt-24">
          <h1 className="text-center text-4xl font-bold mb-3 text-gray-500">
            You're almost there
          </h1>
          <p className="text-center text-xl text-gray-400">
            Please sign in to access your workouts!
          </p>
          <Button className="mt-4" onClick={handleSignIn}>
            Sign In
          </Button>
        </div>
      )}
    </>
  )
}

export default ExerciseTracker
