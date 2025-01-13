import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/LogModal"
import type { WorkoutLog } from "@/types/workout"

const ExerciseTracker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSaveWorkout = (workout: WorkoutLog) => {
    console.log(workout)
  }

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
    </div>
  )
}

export default ExerciseTracker