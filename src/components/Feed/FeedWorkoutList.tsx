import { Workout } from "@/types/workout"
import WorkoutCard from "../common/WorkoutCard"

type FeedWorkoutListProps = {
  workoutList: Workout[] | null
  openComments: (workout: Workout) => void
}

function FeedWorkoutList(props: FeedWorkoutListProps) {
  const workoutList = props.workoutList

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {workoutList?.map((workout, key) => (
          <WorkoutCard
            key={key}
            userId={workout.userId}
            workout={workout}
            openComments={props.openComments}
          />
        ))}
      </div>
    </div>
  )
}

export default FeedWorkoutList
