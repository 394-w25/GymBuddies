import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import type { Exercise, Set } from "@/types/workout"

interface ExerciseCardProps {
  exercise: Exercise
  onUpdate: (exercise: Exercise) => void
}

export function ExerciseCard({ exercise, onUpdate }: ExerciseCardProps) {
  const [name, setName] = useState(exercise.name)

  const addSet = () => {
    const newSet: Set = {
      number: exercise.sets.length + 1,
      weight: 0,
      reps: 0,
    }
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet],
    })
  }

  const updateSet = (
    setIndex: number,
    field: "weight" | "reps",
    value: number
  ) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.map((set, index) =>
        index === setIndex ? { ...set, [field]: value } : set
      ),
    })
  }

  const updateName = (newName: string) => {
    setName(newName)
    onUpdate({
      ...exercise,
      name: newName,
    })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-0 space-y-0 pb-2">
        <Input
          value={name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Exercise name"
          className="text-lg font-semibold border-none bg-transparent h-auto p-0 focus-visible:ring-0"
        />
        <Button variant="ghost" size="icon" className="ml-auto">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Set</TableHead>
              <TableHead className="w-[100px]">Lbs</TableHead>
              <TableHead className="w-[100px]">Reps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercise.sets.map((set, index) => (
              <TableRow key={index}>
                <TableCell>{set.number}</TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={set.weight}
                    onChange={(e) =>
                      updateSet(index, "weight", parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={set.reps}
                    onChange={(e) =>
                      updateSet(index, "reps", parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" className="w-full mt-4" onClick={addSet}>
          + Add Set
        </Button>
      </CardContent>
    </Card>
  )
}
