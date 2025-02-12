import { useUser } from "@/components/Layout/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  getAllUserWorkouts,
  listenToFollowingChanged,
  listenToFollowersChanged,
  listenToUserWorkouts,
  getUser,
  followUser,
  unfollowUser,
} from "@/lib/db"
import { Workout } from "@/types/workout"
import WeightliftingChart from "@/components/Profile/WeightliftingChart"
import { getPoundsPerPeriod } from "@/lib/count_workouts"
import { useNavigate, useParams } from "react-router"
import { User } from "@/types/user"
import WorkoutCard from "@/components/common/WorkoutCard"
import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"

const Profile = () => {
  const { uid } = useParams()
  const { user, handleSignIn } = useUser()
  const navigate = useNavigate()

  const [profileUser, setProfileUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(true)
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([])
  const [monthOrYear, setMonthOrYear] = useState("month")
  const [friendsData, setFriendsData] = useState<{
    following: string[]
    followers: string[]
  }>({ following: [], followers: [] })
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  const graphData = getPoundsPerPeriod(
    userWorkouts,
    monthOrYear === "month" ? new Date().getMonth() : new Date().getFullYear()
  )

  useEffect(() => {
    if (uid) {
      if (user && user.userId == uid) {
        setProfileUser(user)
      } else {
        const getUserInfo = async () => {
          const profileUserInfo = await getUser(uid)
          if (profileUserInfo) {
            setProfileUser(profileUserInfo as User)
          } else {
            setLoading(false)
          }
        }

        getUserInfo()
      }
    } else if (user) {
      setProfileUser(user)
    }
  }, [user, uid])

  useEffect(() => {
    if (profileUser !== undefined) {
      setLoading(false)
    }
  }, [profileUser])

  useEffect(() => {
    if (!profileUser) return

    const fetchUserWorkouts = async () => {
      const res = await getAllUserWorkouts(profileUser.userId)
      if (res) {
        setUserWorkouts(res)
      }
    }

    const unsubscribe = listenToUserWorkouts(profileUser.userId, () =>
      fetchUserWorkouts()
    )

    return () => unsubscribe()
  }, [profileUser])

  useEffect(() => {
    if (profileUser) {
      const unsubscribe = listenToFollowingChanged(
        profileUser.userId,
        (following) =>
          setFriendsData((prev) => {
            return { ...prev, following: following }
          })
      )

      return () => unsubscribe()
    }
  }, [profileUser])

  useEffect(() => {
    if (profileUser) {
      const unsubscribe = listenToFollowersChanged(
        profileUser.userId,
        (followers) => {
          setFriendsData((prev) => {
            return { ...prev, followers: followers }
          })

          if (user) {
            setIsFollowing(followers.includes(user.userId))
          }
        }
      )

      return () => unsubscribe()
    }
  }, [profileUser, user])

  const handleFollowUser = async () => {
    if (!user || !profileUser) return

    const success = await followUser(user.userId, profileUser?.userId)
    if (success) {
      setIsFollowing(true)
    }
  }

  const handleUnfollowUser = async () => {
    if (!user || !profileUser) return

    const success = await unfollowUser(user.userId, profileUser?.userId)
    if (success) {
      setIsFollowing(false)
    }
  }

  return (
    <>
      {profileUser && (
        <div className="flex flex-col items-center w-full">
          <div className="profile-pic-and-name flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={profileUser.profilePic} />
              <AvatarFallback>{profileUser.name.at(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            {profileUser.bio && (
              <p className="text-gray-600 w-[80%] my-4">{profileUser.bio}</p>
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

            {user && profileUser.userId !== user.userId && (
              <div className="mt-2">
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
                              Unfollow {profileUser.name}?
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
              </div>
            )}
          </div>

          <div className="stats-portion w-full flex flex-col gap-4 mt-4">
            <div>
              <h1 className="text-2xl font-bold text-left text-gray-700">
                Strength Tracker
              </h1>
              <p className="text-sm text-muted-foreground text-left">
                Track your progress, watch your growth
              </p>
            </div>
            <Card className="w-full flex flex-col text-left">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row w-full justify-between">
                  <div>
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

          {user && profileUser.userId !== user.userId && (
            <div className="w-full flex flex-col gap-4 mt-4">
              <h1 className="text-2xl font-bold text-left text-gray-700">
                Workout History
              </h1>
              {userWorkouts?.map((workout, key) => (
                <WorkoutCard
                  key={key}
                  userId={workout.userId}
                  workout={workout}
                  username={profileUser.name}
                  profilePic={profileUser.profilePic}
                  displayProfile={false}
                  displayComments={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!profileUser && (
        <>
          {uid == undefined ? (
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
          ) : (
            <>
              {!loading && (
                <div className="empty-following-message flex flex-col items-center justify-center mt-24">
                  <h1 className="text-center text-4xl font-bold mb-3 text-gray-500">
                    We can't find who you're looking for...
                  </h1>
                  <p className="text-center text-xl text-gray-400">
                    This user does not exist.
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/")}>
                    Go Home
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default Profile
