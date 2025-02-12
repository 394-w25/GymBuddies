import { useUser } from "@/components/Layout/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import {
  getAllUserWorkouts,
  sortWorkouts,
  getFollowersOfUser,
  getFollowingOfUser,
} from "@/lib/db"
import { Workout } from "@/types/workout"
import WeightliftingChart from "@/components/Profile/WeightliftingChart"
import { getPoundsPerPeriod } from "@/lib/count_workouts"

const Profile = () => {
  const { user, refreshUser, handleSignIn } = useUser()
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([])
  const [monthOrYear, setMonthOrYear] = useState("month")
  const [friendsData, setFriendsData] = useState<{
    following: string[]
    followers: string[]
  }>({ following: [], followers: [] })

  const memoizedUserWorkouts = useMemo(() => userWorkouts, [userWorkouts])

  // Memoize graphData to recalculate only when userWorkouts or monthOrYear changes
  const graphData = useMemo(() => {
    return getPoundsPerPeriod(
      memoizedUserWorkouts,
      monthOrYear === "month" ? new Date().getMonth() : new Date().getFullYear()
    )
  }, [memoizedUserWorkouts, monthOrYear])

  useEffect(() => {
    if (user) {
      refreshUser() // make sure everything up to date

      const fetchUserWorkouts = async () => {
        if (user) {
          const res = await getAllUserWorkouts(user.userId)
          if (res) {
            res.reverse()
            // console.log(res)
            const sorted = sortWorkouts(res)
            setUserWorkouts(sorted)
          }
        }
      }

      const fetchUserFollowersFollowing = async () => {
        if (user) {
          const [followersList, followingList] = await Promise.all([
            getFollowersOfUser(user.userId),
            getFollowingOfUser(user.userId),
          ])

          // console.log(
          //   `FOLLOWERS : ${followersList} -- FOLLOWING : ${followingList}`
          // )

          if (followersList !== undefined && followingList !== undefined) {
            setFriendsData((prev) => {
              return {
                ...prev,
                following: followingList as string[],
                followers: followersList as string[],
              }
            })
          }
        }
      }

      const fetchTogether = async () => {
        await fetchUserFollowersFollowing()
        await fetchUserWorkouts()
      }

      fetchTogether()

      const interval = setInterval(fetchTogether, 30000) // 30 seconds
      return () => {
        clearInterval(interval) // clear on dismount
      }
    }
  }, [user, refreshUser])

  // useEffect(() => {
  //   setGraphData(
  //     getPoundsPerPeriod(
  //       userWorkouts,
  //       new Date().getMonth()
  //     )
  //   )
  // }, [userWorkouts, monthOrYear]);

  return (
    <>
      {user && (
        <div className="flex flex-col items-center w-full">
          <div className="profile-pic-and-name flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback>{user.name.at(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.bio && (
              <p className="text-gray-600 w-[80%] my-4">{user.bio}</p>
            )}

            {/* FOLLOWERS AND FOLLOWING */}
            <div className="follower-following flex flex-row w-full gap-10 justify-center items-center">
              <p className="">
                <span className="font-bold">
                  {friendsData.followers.length}
                </span>{" "}
                Followers
              </p>
              <p className="">
                <span className="font-bold">
                  {friendsData.following.length}
                </span>{" "}
                Following
              </p>
            </div>
          </div>

          <div className="stats-portion w-full flex flex-col">
            <Card className="w-full mt-5 flex flex-col text-left">
              <CardHeader>
                <div className="flex flex-col md:flex-row w-full justify-between">
                  <div>
                    <CardTitle>Strength Tracker</CardTitle>
                    <CardDescription>
                      Track your progress, watch your growth.
                    </CardDescription>
                  </div>

                  <div className="mt-3 md:mt-0">
                    <Label htmlFor="time-period">Time Period</Label>
                    <Select onValueChange={(val) => setMonthOrYear(val)}>
                      <SelectTrigger className="lg:w-[180px]" id="time-period">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="w-full h-full flex flex-col ">
                <WeightliftingChart
                  data={monthOrYear === "month" ? graphData[0] : graphData[1]}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!user && (
        <div className="empty-following-message flex flex-col items-center justify-center mt-24">
          <h1 className="text-center text-4xl font-bold mb-3 text-gray-500">
            Who's this?
          </h1>
          <p className="text-center text-xl text-gray-400">
            Please sign in to access your profile!
          </p>
          <Button className="mt-4" onClick={handleSignIn}>
            Sign In
          </Button>
          <p className="text-center italic text-sm mt-3 text-gray-300">
            No seriously, who are you...
          </p>
        </div>
      )}
    </>
  )
}

export default Profile
