import { useEffect, useState } from "react"
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
import { Trash, X } from "lucide-react"
import type { Exercise, Set } from "@/types/workout"

interface ExerciseCardProps {
  exercise: Exercise
  onUpdate: (exercise: Exercise) => void
  onDelete: () => void
}

export function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
}: ExerciseCardProps) {
  const [name, setName] = useState(exercise.name)

  useEffect(() => {
    setName(exercise.name)
  }, [exercise])

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

  const deleteSet = (setIndex: number) => {
    const filteredSets = exercise.sets.filter((_, index) => index !== setIndex)
    const updatedSets = filteredSets.map((set, index) => ({
      ...set,
      number: index + 1,
    }))

    onUpdate({
      ...exercise,
      sets: updatedSets,
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
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={onDelete}
        >
          <Trash className="h-4 w-4" color="#c70000" />
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
                <TableCell className="p-0">
                  <Button
                    variant={"destructive"}
                    className="py-1 px-2"
                    onClick={() => deleteSet(index)}
                  >
                    <X />
                  </Button>
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
