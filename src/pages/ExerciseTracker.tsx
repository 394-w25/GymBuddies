import { useEffect, useState } from "react"
import { addWorkout, getAllUserWorkouts } from "@/lib/db"
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

      {user && (
        <div className="flex flex-col gap-4">
          {userWorkouts?.map((workout, key) => (
            <WorkoutCard
              key={key}
              userId={workout.userId}
              workout={workout}
              username={user.name}
              profilePic={user.profilePic}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExerciseTracker
