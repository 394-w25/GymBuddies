import { useEffect, useState } from "react"
import { addWorkout, getAllUserWorkouts } from "@/lib/db"
import {
  calculateMinutesBetweenDates,
  calculateWorkoutVolume,
} from "@/lib/utils"
import { useUser } from "@/components/Layout/UserContext"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/WorkoutInput"
import WorkoutCard from "@/components/common/WorkoutCard"
import type { Workout, WorkoutLog } from "@/types/workout"

const ExerciseTracker = () => {
  const { user } = useUser()
  const [userWorkouts, setUserWorkouts] = useState<Workout[] | null>([])
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      if (user) {
        const res = await getAllUserWorkouts(user.userId)
        if (res) {
          res.reverse()
          console.log(res)
          setUserWorkouts(res)
        }
      }
    }

    fetchUserWorkouts()
  }, [user])

  const handleSaveWorkout = async (workout: WorkoutLog) => {
    // Todo: Zero out seconds
    console.log(workout)
    if (user && workout.exercises.length > 0) {
      await addWorkout(user.userId, workout)
    }
  }

  return (
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

      {/* // Todo: Simplify props, only have to pass in workout here */}
      {user && (
        <div className="flex flex-col gap-4">
          {userWorkouts?.map((workout, key) => (
            <WorkoutCard
              key={key}
              username={user.name}
              title={workout.title}
              caption={workout.caption}
              date={workout.date}
              durationInMinutes={calculateMinutesBetweenDates(
                workout.startTime,
                workout.endTime
              )}
              volume={calculateWorkoutVolume(workout.exercises)}
              exercises={workout.exercises}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExerciseTracker
