import { useEffect, useState } from "react"
import { getUser } from "@/lib/db"
import { calculateWorkoutVolume, getBestSet } from "@/lib/utils"
import Moment from "react-moment"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import type { Exercise, Workout } from "@/types/workout"
import type { User } from "@/types/user"

interface ExerciseRowProps {
  exercise: Exercise
}

const ExerciseRow = ({ exercise }: ExerciseRowProps) => {
  return (
    <div className="rounded-md border px-3 py-3 text-sm mb-1 flex justify-between">
      <h2>{exercise.name}</h2>
      <h2>{getBestSet(exercise)}</h2>
    </div>
  )
}

interface WorkoutCardProps {
  userId: string
  workout: Workout
  username?: string
  profilePic?: string
  displayProfile?: boolean
}

const WorkoutCard = ({
  userId,
  workout,
  username,
  profilePic,
  displayProfile = true,
}: WorkoutCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    const getUserInfo = async () => {
      const user = await getUser(userId)
      if (user) {
        setUser(user)
      }
    }

    getUserInfo()
  }, [userId])

  const getMinutes = () => {
    const start = new Date(workout.startTime).getTime()
    const end = new Date(workout.endTime).getTime()

    const minutes = (end - start) / (1000 * 60)
    return minutes
  }

  const durationInMinutes = getMinutes()

  const volume = calculateWorkoutVolume(workout.exercises)

  let durationString
  if (durationInMinutes < 60) {
    durationString = durationInMinutes + " minutes"
  } else {
    const hours = Math.round((durationInMinutes / 60) * 10) / 10
    if (hours <= 1) {
      durationString = hours + " hour"
    } else {
      durationString = hours + " hours"
    }
  }

  let volumeString
  if (volume < 1000) {
    volumeString = volume.toString()
  } else {
    const volumeApprox = Math.round((volume / 1000) * 10) / 10
    volumeString = volumeApprox + "k"
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        {displayProfile && (
          <div
            className={`flex flex-col justify-center items-center ${
              workout.title || workout.caption ? "mb-4" : ""
            }`}
          >
            <div className="flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={profilePic || user?.profilePic} />
                <AvatarFallback>
                  {username?.at(0) || user?.name.at(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-bold text-xl">{username || user?.name}</h1>
            </div>
          </div>
        )}
        {workout.title && <CardTitle>{workout.title}</CardTitle>}
        {workout.caption && (
          <CardDescription>{workout.caption}</CardDescription>
        )}
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent>
        <div className="flex justify-between items-center gap-6 px-2 mb-6">
          <div className="flex flex-col">
            <h2 className="font-bold">Date</h2>
            <Moment format="M/D/YY">{workout.date}</Moment>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Duration</h2>
            <p>{durationString}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Volume</h2>
            <p>{volumeString} lbs</p>
          </div>
        </div>

        <div className="flex justify-between mb-1">
          <h1 className="font-bold">Exercise</h1>
          <h1 className="font-bold">Best Set</h1>
        </div>
        <ExerciseRow exercise={workout.exercises[0]} />

        {workout.exercises.length > 1 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="flex flex-col mb-1">
                {workout.exercises.slice(1).map((exercise, key) => (
                  <ExerciseRow exercise={exercise} key={key} />
                ))}
              </div>
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button variant="ghost">
                <div className="flex items-center gap-1">
                  <h2>See Full Workout</h2>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

export default WorkoutCard
