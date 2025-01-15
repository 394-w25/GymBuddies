import { useState, useEffect } from "react"
import { getAllWorkouts } from "@/lib/db"
import WorkoutCard from "@/components/common/WorkoutCard"
import type { Workout } from "@/types/workout"

const Feed = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[] | null>([])

  useEffect(() => {
    const fetchUserWorkouts = async () => {
      const res = await getAllWorkouts()
      if (res) {
        res.reverse()
        console.log(res)
        setAllWorkouts(res)
      }
    }

    fetchUserWorkouts()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {allWorkouts?.map((workout, key) => (
          <WorkoutCard key={key} userId={workout.userId} workout={workout} />
        ))}
      </div>
    </div>
  )
}

export default Feed
