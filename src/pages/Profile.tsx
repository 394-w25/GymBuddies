import WeightliftingChart from "@/components/Profile/WeightliftingChart"
import { useUser } from "@/components/Layout/UserContext"
import { getPoundsPerPeriod, WeightData } from "@/lib/count_workouts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { getAllUserWorkouts, sortWorkouts } from "@/lib/db"
import { Workout } from "@/types/workout"
import WorkoutCard from "@/components/common/WorkoutCard"



const Profile = () => {
  const { user } = useUser();
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);
  // console.log(`bio : ${user.bio}`);
  // const [weightData, setWeightData] = useState<WeightData[]>([]);
  // const [weeks, months] = getPoundsPerPeriod(userWorkouts, (new Date()).getMonth());
  // console.log(`weeks : ${JSON.stringify(weeks)}`)
  // setWeightData(weeks);


  useEffect(() => {
    const fetchUserWorkouts = async () => {
      if (user) {
        const res = await getAllUserWorkouts(user.userId)
        if (res) {
          res.reverse()
          console.log(res)
          const sorted = sortWorkouts(res)
          setUserWorkouts(sorted)
        }
      }
    }

    fetchUserWorkouts()

    // Set up an interval to fetch every 10 seconds
    const interval = setInterval(() => {
      fetchUserWorkouts()
    }, 8000)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [user])

  // useEffect(() => {
  //   const [weeks, months] = getPoundsPerPeriod(userWorkouts, (new Date()).getMonth());
  //   console.log(`weeks : ${JSON.stringify(weeks)}`)
  //   setWeightData(weeks);

  // }, [userWorkouts])




  return (
    <div className="w-full">
      {user && (
        <div className="flex flex-col items-center w-full">
          <div className="profile-pic-and-name flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback>{user.name.at(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.bio && <p className="text-gray-600 w-[80%] my-4">{user.bio}</p>}
          </div>

          <div className="stats-portion w-full flex flex-col">
            <Card className="w-full mt-5 flex flex-col text-left">
              <CardHeader>
                <div className="flex flex-col md:flex-row w-full justify-between">
                  <div>
                    <CardTitle>Strength Tracker</CardTitle>
                    <CardDescription>Track your progress, watch your growth.</CardDescription>
                  </div>

                  <div className="mt-3 md:mt-0">
                    <Label htmlFor="time-period">Time Period</Label>
                    <Select>
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
                <WeightliftingChart data={getPoundsPerPeriod(userWorkouts, (new Date()).getMonth())[0]} />
              </CardContent>
            </Card>
          </div>


          <div className="workouts-feed w-full flex overflow-y-scroll max-h-[80vh] mt-5 p-4 box-border border bg-teal-50 shadow-inner rounded-md">
            <div className="flex flex-col gap-4 w-full">
              {userWorkouts?.map((workout, key) => (
                <WorkoutCard
                  key={key}
                  userId={workout.userId}
                  workout={workout}
                  username={user.name}
                  profilePic={user.profilePic}
                  displayProfile={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="w-full min-h-[200px] flex flex-col justify-center items-center">
          <h2 className="text-center text-2xl font-semibold">
            Please log in to see workout data!
          </h2>
        </div>
      )}
    </div>
  )
}

export default Profile
