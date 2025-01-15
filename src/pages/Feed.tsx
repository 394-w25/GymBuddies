import WorkoutCard from "@/components/common/WorkoutCard"

const Feed = () => {
  return (
    <WorkoutCard
      username="Chip"
      title="Great workout today"
      caption="I can't walk anymore"
      date={new Date()}
      durationInMinutes={80}
      volume={10000}
      exercises={[
        { name: "Dumbbell Curls", sets: [] },
        { name: "Bench Press", sets: [] },
        { name: "Squats", sets: [] },
      ]}
    />
  )
}

export default Feed
