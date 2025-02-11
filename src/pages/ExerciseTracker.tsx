import { useEffect, useState } from "react"
import { addWorkout, getAllUserWorkouts, sortWorkouts } from "@/lib/db"
import { useUser } from "@/components/Layout/UserContext"
import { Button } from "@/components/ui/button"
import { WorkoutLogModal } from "@/components/ExerciseTracker/WorkoutInput"
import WorkoutCard from "@/components/common/WorkoutCard"
import type { Workout, WorkoutLog } from "@/types/workout"

const ExerciseTracker = () => {
  const { user, handleSignIn } = useUser()
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

  const handleSaveWorkout = async (workout: WorkoutLog) => {
    // Todo: Display error to user
    if (!user || workout.exercises.length == 0) return

    const res = await addWorkout(user.userId, workout)
    if (res !== false && userWorkouts !== null) {
      const newWorkouts: Workout[] = [
        ...userWorkouts,
        { ...workout, userId: user.userId, workoutId: res },
      ]
      setUserWorkouts(sortWorkouts(newWorkouts))
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
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!user && (
        <div className="w-full min-h-[200px] gap-3 flex flex-col justify-center items-center">
          <h2 className="text-center text-2xl font-semibold">
            Sign in to access your workout tracker
          </h2>
          <Button onClick={handleSignIn}>Sign In</Button>
        </div>
      )}
    </>
  )
}

export default ExerciseTracker
