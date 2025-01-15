import { useState } from "react"
// import moment from "moment"
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

import type { Exercise } from "@/types/workout"

interface ExerciseRowProps {
  exercise: Exercise
}

const ExerciseRow = ({ exercise }: ExerciseRowProps) => {
  return (
    <div className="rounded-md border px-3 py-3 text-sm mb-1 flex justify-between">
      <h2>{exercise.name}</h2>
      <h2>---</h2>
    </div>
  )
}

interface WorkoutCardProps {
  username: string
  profilePic?: string
  title: string
  caption: string
  date: Date
  durationInMinutes: number
  volume: number
  exercises: [Exercise, ...Exercise[]]
}

const WorkoutCard = ({ ...props }: WorkoutCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  let durationString
  if (props.durationInMinutes < 60) {
    durationString = props.durationInMinutes + " minutes"
  } else {
    const hours = Math.round((props.durationInMinutes / 60) * 10) / 10
    if (hours <= 1) {
      durationString = hours + " hour"
    } else {
      durationString = hours + " hours"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex flex-col justify-center items-center mb-4">
          <div className="flex justify-center items-center gap-2">
            <Avatar>
              <AvatarImage src={props.profilePic} />
              <AvatarFallback>{props.username[0]}</AvatarFallback>
            </Avatar>
            <h1 className="font-bold text-xl">{props.username}</h1>
          </div>
        </div>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.caption}</CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent>
        <div className="flex justify-between items-center gap-6 px-2 mb-6">
          <div className="flex flex-col">
            <h2 className="font-bold">Date</h2>
            {/* <p>{moment(props.date).format("M/D/Y")}</p> */}
            <Moment format="M/D/Y">{props.date}</Moment>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Duration</h2>
            <p>{durationString}</p>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Volume</h2>
            <p>{props.volume.toLocaleString()} lbs</p>
          </div>
        </div>

        <div className="flex justify-between mb-1">
          <h1 className="font-bold">Exercise</h1>
          <h1 className="font-bold">Best Set</h1>
        </div>
        {/* Todo: Calculate best set */}
        <ExerciseRow exercise={props.exercises[0]} />

        {props.exercises.length > 1 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              <div className="flex flex-col mb-1">
                {props.exercises.slice(1).map((exercise, key) => (
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
