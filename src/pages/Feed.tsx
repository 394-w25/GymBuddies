import { useState, useEffect } from "react"
import { getAllWorkouts, sortWorkouts, getWorkoutsOfFollowing } from "@/lib/db"
import type { Workout } from "@/types/workout"
import FeedWorkoutList from "@/components/Feed/FeedWorkoutList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/components/Layout/UserContext"

const Feed = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[] | null>([])
  const [followingWorkouts, setFollowingWorkouts] = useState<Workout[] | []>([]);
  const {user} = useUser();


  useEffect(() => {
    const fetchUserWorkouts = async () => {
      const res = await getAllWorkouts()
      if (res) {
        // res.reverse()
        // console.log(res)
        const sortedRes = sortWorkouts(res);
        setAllWorkouts(sortedRes);
      }
    }



    fetchUserWorkouts()

    // Set up an interval to fetch every 10 seconds
    const interval = setInterval(() => {
      fetchUserWorkouts()
    }, 8000)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchFollowingWorkouts = async () => {
      if (user?.userId) {
        const res = await getWorkoutsOfFollowing(user.userId);
        if (res.length === 0) {
          setFollowingWorkouts([]);
        }
        const sortedRes = sortWorkouts(res);
        setFollowingWorkouts(sortedRes);
      }
    }

    fetchFollowingWorkouts();
    const interval = setInterval(() => {
      fetchFollowingWorkouts();
    }, 60000) // once per minute

    return () => clearInterval(interval);

  }, [user])

  return (
    <Tabs defaultValue="public" className="w-full ">
      <TabsList className=" grid w-[104%] -ml-[2%] md:w-[102%] md:-ml-[1%] grid-cols-2 bg-gray-200 sticky top-[74px] z-50 ">
        <TabsTrigger value="public" >Public</TabsTrigger>
        <TabsTrigger value="following" >Following Only</TabsTrigger>
      </TabsList>

      <TabsContent value='public'>
        <FeedWorkoutList workoutList={allWorkouts} />
      </TabsContent>

      <TabsContent value='following'>
        {
          (followingWorkouts.length > 0)
          ?
          <FeedWorkoutList workoutList={followingWorkouts} />
          :
          <div className="empty-following-message flex flex-col items-center justify-center min-h-[30vh] mt-24">

            <h1 className="text-center text-4xl font-bold mb-3 text-gray-500">No workouts to display...</h1>
            <p className="text-center text-xl text-gray-400">Make sure you're logged in, following some friends, and that they're active on the app!</p>

          </div>
        }
      </TabsContent>
    </Tabs>
  )
}

export default Feed
