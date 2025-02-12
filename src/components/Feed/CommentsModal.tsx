import { useEffect, useState } from "react"
import { getUser, commentOnWorkout } from "@/lib/db"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowUp } from "lucide-react"
import { Workout, Comment as CommentType } from "@/types/workout"
import { User } from "@/types/user"

interface CommentProps {
  uid: string
  comment: string
}

export function Comment({ uid, comment }: CommentProps) {
  const [commentUser, setCommentUser] = useState<User | null>()
  const [commenterName, setCommenterName] = useState<string>(
    `User ${uid.slice(0, 4)}`
  )

  useEffect(() => {
    const getUserInfo = async () => {
      const commenterProfile = await getUser(uid)
      if (commenterProfile) {
        setCommentUser(commenterProfile as User)
        setCommenterName(commenterProfile.name)
      }
    }

    getUserInfo()
  }, [uid])

  return (
    <div className="flex items-start space-x-2 p-4">
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={`${commentUser?.profilePic}`}
          alt={`${commentUser?.name}`}
        />
        <AvatarFallback>
          {commenterName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-0.5">
        <p className="text-sm text-gray-500 font-medium leading-none">
          {commenterName}
        </p>
        <p className="text-md">{comment}</p>
      </div>
    </div>
  )
}

interface CommentInputProps {
  workoutId: string
  commenterId: string
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>
}

const CommentInput = ({
  workoutId,
  commenterId,
  setComments,
}: CommentInputProps) => {
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await commentOnWorkout(workoutId, commenterId, comment)
    if (success) {
      console.log("Submitted comment:", comment)
      setComments((prevComments) => [
        ...prevComments,
        { uid: commenterId, comment: comment },
      ])
      setComment("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="pr-10"
      />
      <div
        className={`absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
          comment ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <Button type="submit" size="icon" className="h-7 w-7">
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

interface CommentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: Workout | null
  commenterUid: string | null
}

const CommentsModal = ({
  open,
  onOpenChange,
  workout,
  commenterUid,
}: CommentsModalProps) => {
  const [comments, setComments] = useState<CommentType[]>([])

  useEffect(() => {
    setComments(workout?.comments || [])
  }, [workout])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[75vh] overflow-y-auto rounded-t-2xl flex flex-col justify-between"
      >
        <SheetHeader className="flex-row items-center justify-center space-y-0">
          <SheetTitle className="text-2xl font-bold">Comments</SheetTitle>
          <SheetDescription className="hidden">
            Comments for this workout
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow">
          {comments?.map(({ uid, comment }, key) => (
            <Comment key={key} uid={uid} comment={comment} />
          ))}
        </div>
        <SheetFooter>
          {commenterUid && workout && (
            <CommentInput
              workoutId={workout?.workoutId}
              commenterId={commenterUid}
              setComments={setComments}
            />
          )}

          {!commenterUid && (
            <div className="empty-following-message flex flex-col items-center justify-center">
              <p className="text-center text-xl text-gray-400">
                Sign in to leave a comment...
              </p>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CommentsModal
