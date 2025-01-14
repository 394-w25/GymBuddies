import { useState } from "react"
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
import { Separator } from "../ui/separator"

interface ExerciseCardProps {
  name: string
  bestSet?: string
}

const ExerciseCard = ({ name, bestSet = "---" }: ExerciseCardProps) => {
  return (
    <div className="rounded-md border px-3 py-3 text-sm mb-1 flex justify-between">
      <h2>{name}</h2>
      <h2>{bestSet}</h2>
    </div>
  )
}

const PostCard = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Card>
      <CardHeader className="pb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center items-center gap-2">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>EX</AvatarFallback>
            </Avatar>
            <h2 className="font-bold">Name</h2>
          </div>
          <div>
            {/* Change to button */}
            <h2>...</h2>
          </div>
        </div>
        <CardTitle>Great workout today</CardTitle>
        <CardDescription>I can't walk anymore</CardDescription>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent>
        <div className="flex justify-between items-center gap-6 px-2 mb-6">
          <div className="flex flex-col">
            <h2 className="font-bold">Date</h2>
            <p>1/13/25</p>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Duration</h2>
            <p>1 hour</p>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold">Volume</h2>
            <p>10,000 lbs</p>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-between mb-1">
            <h1 className="font-bold">Exercise</h1>
            <h1 className="font-bold">Best Set</h1>
          </div>
          <ExerciseCard name="Exercise 1" />
          <CollapsibleContent>
            <div className="flex flex-col mb-1">
              <ExerciseCard name="Exercise 2" bestSet="75 lb x 12" />
              <ExerciseCard name="Exercise 3" />
              <ExerciseCard name="Exercise 4" bestSet="25 lb x 15" />
              <ExerciseCard name="Exercise 5" />
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
      </CardContent>
    </Card>
  )
}

export default PostCard
