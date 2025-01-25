import WeightliftingChart from "@/components/Profile/WeightliftingChart"
import { useUser } from "@/components/Layout/UserContext"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



const Profile = () => {
  const { user } = useUser()
  // console.log(`bio : ${user.bio}`);

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
                <div className="flex w-full justify-between">
                  <div>
                    <CardTitle>Strength Tracker</CardTitle>
                    <CardDescription>Track your progress, watch your growth.</CardDescription>
                  </div>

                  <div className="">
                    <Label htmlFor="time-period">Time Period</Label>
                    <Select>
                      <SelectTrigger className="w-[180px]" id="time-period">
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
                <WeightliftingChart timePeriod="month" />
              </CardContent>
            </Card>
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
