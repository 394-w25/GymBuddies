import { useState, useEffect } from "react"
import { listenToWorkouts } from "@/lib/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FeedWorkoutList from "@/components/Feed/FeedWorkoutList"
import CommentsModal from "@/components/Feed/CommentsModal"
import { useUser } from "@/components/Layout/UserContext"
import type { Workout } from "@/types/workout"

const Feed = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[] | null>([])
  const [followingWorkouts, setFollowingWorkouts] = useState<Workout[] | []>([])
  const [commentsModalOpen, setCommentsModalOpen] = useState<boolean>(false)
  const [commentsModalWorkout, setCommentsModalWorkout] =
    useState<Workout | null>(null)

  const { user } = useUser()

  useEffect(() => {
    const unsubscribe = listenToWorkouts((workouts) => {
      setAllWorkouts(workouts)
      setFollowingWorkouts(
        workouts.filter((workout) => {
          return user?.following?.includes(workout.userId)
        })
      )
    })

    return () => unsubscribe()
  }, [user])

  const openComments = (workout: Workout) => {
    if (!commentsModalOpen) {
      setCommentsModalOpen(true)
      setCommentsModalWorkout(workout)
    }
  }

  return (
    <>
      {user && (
        <>
          <Tabs defaultValue="public" className="w-full ">
            <TabsList className=" grid grid-cols-2 bg-gray-200  z-50 ">
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>

            <TabsContent value="public">
              <FeedWorkoutList
                workoutList={allWorkouts}
                openComments={openComments}
              />
            </TabsContent>

            <TabsContent value="following">
              {followingWorkouts.length > 0 ? (
                <FeedWorkoutList
                  workoutList={followingWorkouts}
                  openComments={openComments}
                />
              ) : (
                <div className="empty-following-message flex flex-col items-center justify-center min-h-[30vh] mt-24">
                  <h1 className="text-center text-4xl font-bold mb-3 text-gray-500">
                    No workouts to display...
                  </h1>
                  <p className="text-center text-xl text-gray-400">
                    Make sure you're logged in, following some friends, and that
                    they're active on the app!
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}

      {!user && (
        <FeedWorkoutList
          workoutList={allWorkouts}
          openComments={openComments}
        />
      )}

      <CommentsModal
        open={commentsModalOpen}
        onOpenChange={setCommentsModalOpen}
        workout={commentsModalWorkout}
        commenterUid={user?.userId || null}
      />
    </>
  )
}

export default Feed
