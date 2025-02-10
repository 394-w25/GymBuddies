import { Workout } from '@/types/workout'
import WorkoutCard from '../common/WorkoutCard';

type Props = {
    workoutList : Workout[] | null;
}

function FeedWorkoutList(props: Props) {
    const workoutList = props.workoutList;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {workoutList?.map((workout, key) => (
          <WorkoutCard key={key} userId={workout.userId} workout={workout} />
        ))}
      </div>
    </div>
  )
}

export default FeedWorkoutList