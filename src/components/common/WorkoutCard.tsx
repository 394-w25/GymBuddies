import { useEffect, useState } from "react"
import {
  getUser,
  likeWorkout,
  unlikeWorkout,
  listenToWorkoutLikes,
  followUser,
  unfollowUser,
  listenToFollowingChanged,
} from "@/lib/db"
import { calculateWorkoutVolume, getBestSet } from "@/lib/utils"
import { useUser } from "@/components/Layout/UserContext"
import Moment from "react-moment"
import { ChevronsUpDown, MessageCircle, Trash, Check } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FaHeart } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

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
  displayComments?: boolean
  displayDelete?: boolean
  openComments?: (workout: Workout) => void
  onDelete?: () => void
}

const WorkoutCard = ({
  userId,
  workout,
  username,
  profilePic,
  displayComments = true,
  displayProfile = true,
  displayDelete = false,
  openComments,
  onDelete,
}: WorkoutCardProps) => {
  const { user } = useUser()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [cardUser, setCardUser] = useState<User | null>()
  const [likeCount, setLikeCount] = useState<number>(workout.likes?.length || 0)
  const [isLiked, setIsLiked] = useState<boolean>(true)
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  useEffect(() => {
    const getUserInfo = async () => {
      const cardUserProfile = await getUser(userId)
      if (cardUserProfile) {
        setCardUser(cardUserProfile as User)
      }
    }

    getUserInfo()
  }, [userId])

  useEffect(() => {
    if (user) {
      setIsLiked(workout.likes?.includes(user.userId))
    }
  }, [user, workout.likes])

  useEffect(() => {
    if (user && cardUser) {
      const unsubscribe = listenToFollowingChanged(user.userId, (following) =>
        setIsFollowing(following.includes(cardUser?.userId))
      )

      return () => unsubscribe()
    }
  }, [user, cardUser])

  useEffect(() => {
    const unsubscribe = listenToWorkoutLikes(workout.workoutId, (likes) => {
      setLikeCount(likes.length)
    })

    return () => unsubscribe()
  }, [workout.workoutId])

  const handleReaction = async () => {
    if (!user) return

    if (isLiked) {
      setLikeCount((prev) => prev - 1)
      setIsLiked(false)

      try {
        await unlikeWorkout(workout.workoutId, user.userId)
      } catch (error) {
        console.error("Failed to record reaction", error)
        setLikeCount((prev) => prev + 1)
        setIsLiked(true)
      }
    } else {
      setLikeCount((prev) => prev + 1)
      setIsLiked(true)

      try {
        await likeWorkout(workout.workoutId, user.userId)
      } catch (error) {
        console.error("Failed to record reaction", error)
        setLikeCount((prev) => prev - 1)
        setIsLiked(false)
      }
    }
  }

  const handleFollowUser = async () => {
    if (!user || !cardUser) return

    const success = await followUser(user.userId, cardUser?.userId)
    if (success) {
      setIsFollowing(true)
    }
  }

  const handleUnfollowUser = async () => {
    if (!user || !cardUser) return

    const success = await unfollowUser(user.userId, cardUser?.userId)
    if (success) {
      setIsFollowing(false)
    }
  }

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
    <Card className="">
      <CardHeader className="pb-6">
        {displayProfile && (
          <div
            className={`flex flex-row ${
              user ? "justify-between" : "justify-center"
            } items-center ${workout.title || workout.caption ? "mb-4" : ""}`}
          >
            <div className="flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={profilePic || cardUser?.profilePic} />
                <AvatarFallback>
                  {username?.at(0) || cardUser?.name.at(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-bold text-xl">
                {username || cardUser?.name}
              </h1>
            </div>
            {user && cardUser && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFollowing ? "following" : "follow"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isFollowing ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        >
                          <motion.div
                            className="flex items-center"
                            initial={{ width: "auto" }}
                            animate={{ width: "auto" }}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Following
                          </motion.div>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Unfollow {cardUser.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to unfollow?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleUnfollowUser}>
                            Unfollow
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button variant="outline" onClick={handleFollowUser}>
                      <motion.div
                        className="flex items-center"
                        initial={{ width: "auto" }}
                        animate={{ width: "auto" }}
                      >
                        Follow
                      </motion.div>
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
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
          <div className="flex flex-col max-w-[32%] overflow-hidden">
            <h2 className="font-bold">Date</h2>
            <Moment format="M/D/YY">{workout.date}</Moment>
          </div>
          <div className="flex flex-col max-w-[32%] overflow-hidden">
            <h2 className="font-bold">Duration</h2>
            <p className="overflow-hidden overflow-ellipsis">
              {durationString}
            </p>
          </div>
          <div className="flex flex-col max-w-[32%] overflow-hidden">
            <h2 className="font-bold">Volume</h2>
            <p className="overflow-hidden overflow-ellipsis">
              {volumeString} lbs
            </p>
          </div>
        </div>

        <div className="flex justify-between mb-1">
          <h1 className="font-bold">Exercise</h1>
          <h1 className="font-bold">Best Set</h1>
        </div>
        {/* Todo: Calculate best set */}
        <ExerciseRow exercise={workout.exercises[0]} />

        {workout.exercises.length > 1 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent
              className={
                "text-popover-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              }
            >
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
        {/* Reaction Button Section */}
        <div className="flex justify-between mt-4">
          <div className="flex gap-1">
            <Button
              className="hover:bg-transparent flex items-center overflow-y-clip"
              variant="outline"
              onClick={handleReaction}
            >
              <FaHeart
                className={`${
                  isLiked && user ? "text-red-500" : "text-gray-400"
                } mr-1`}
              />
              <AnimatePresence mode="wait">
                <motion.span
                  key={likeCount}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {likeCount}
                </motion.span>
              </AnimatePresence>
            </Button>
            {displayComments && (
              <Button
                className="hover:bg-transparent"
                variant="outline"
                onClick={() => {
                  if (openComments !== undefined) {
                    openComments(workout)
                  }
                }}
              >
                <MessageCircle />
                {workout.comments?.length || 0}
              </Button>
            )}
          </div>
          {displayDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="hover:bg-transparent p-3" variant="outline">
                  <Trash color="#c70000" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this workout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutCard
