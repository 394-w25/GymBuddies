import { useState } from "react"
import { useUser } from "@/components/Layout/UserContext"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/WorkoutInput"
import type { WorkoutLog } from "@/types/workout"
import { addWorkout } from "@/lib/db"

const ExerciseTracker = () => {
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    </div>
  )
}

export default ExerciseTracker
