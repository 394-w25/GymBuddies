import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExerciseCard } from "./ExerciseInput"
import { TimePicker } from "../ui/time-picker"
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

  // Needs input validation (future dates only, startTime must be before endTime, prevent empty logs)
  const [title, setTitle] = useState<string>("")
  const [caption, setCaption] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [endTime, setEndTime] = useState<Date>(new Date())

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

  const resetModal = () => {
    onOpenChange(false)
    setDate(new Date())
    setStartTime(new Date())
    setEndTime(new Date())
    setExercises([])
    setTitle("")
    setCaption("")
  }

  const handleSave = () => {
    onSave({
      date: new Date(),
      startTime,
      endTime,
      exercises,
      title,
      caption,
    })
    resetModal()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto"
        showDefaultCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <SheetDescription className="hidden">
            Add a new workout
          </SheetDescription>
          <Button variant="outline" onClick={resetModal}>
            Cancel
          </Button>
          <SheetTitle>Workout Log</SheetTitle>
          <Button onClick={handleSave}>Save</Button>
        </SheetHeader>

        <div className="flex flex-col gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-3xl font-semibold border-none bg-transparent h-auto p-0 focus-visible:ring-0"
          />
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
            className="text-sm font-semibold border-none bg-transparent h-auto p-0 focus-visible:ring-0"
          />
        </div>

        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Start Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !startTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {startTime ? (
                      format(startTime, "hh:mm a")
                    ) : (
                      <span>Start time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <TimePicker
                    date={startTime}
                    setDate={(date) => {
                      if (date !== undefined) setStartTime(date)
                      console.log("setting date : ", date)
                    }}
                    showSeconds={false}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">End Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !endTime && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {endTime ? (
                      format(endTime, "hh:mm a")
                    ) : (
                      <span>End time</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <TimePicker
                    date={endTime}
                    setDate={(date) => {
                      if (date !== undefined) setEndTime(date)
                    }}
                    showSeconds={false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

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
