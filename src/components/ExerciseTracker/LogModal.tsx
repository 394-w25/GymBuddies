import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ExerciseCard } from "./ExerciseCard"
import type { Exercise, WorkoutLog } from "@/types/workout"

interface WorkoutLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (workout: WorkoutLog) => void
}

export function WorkoutLogModal({
  open,
  onOpenChange,
  onSave,
}: WorkoutLogModalProps) {
  const [exercises, setExercises] = useState<Exercise[]>([])

  const addExercise = () => {
    const newExercise: Exercise = {
      name: "",
      sets: [
        {
          number: 1,
          weight: 0,
          reps: 0,
        },
      ],
    }
    setExercises([...exercises, newExercise])
  }

  const updateExercise = (updatedExercise: Exercise, index: number) => {
    setExercises(
      exercises.map((exercise, i) => (i === index ? updatedExercise : exercise))
    )
  }

  const handleSave = () => {
    onSave({ exercises })
    onOpenChange(false)
  }

  const onCancel = () => {
    onOpenChange(false)
    setExercises([])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto"
        showDefaultCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <SheetTitle>Workout Log</SheetTitle>
          <Button onClick={handleSave}>Save</Button>
        </SheetHeader>
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={index}
              exercise={exercise}
              onUpdate={(updatedExercise) =>
                updateExercise(updatedExercise, index)
              }
            />
          ))}
          <Button variant="outline" className="w-full" onClick={addExercise}>
            + Add Exercise
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
