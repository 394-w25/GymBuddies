import { useState, useEffect } from "react"
import { getAllWorkouts, sortWorkouts } from "@/lib/db"
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
        const sortedRes = sortWorkouts(res);
        setAllWorkouts(sortedRes);
      }
    }

    fetchUserWorkouts()

    // Set up an interval to fetch every 10 seconds
    const interval = setInterval(() => {
      fetchUserWorkouts()
    }, 10000)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval)
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
