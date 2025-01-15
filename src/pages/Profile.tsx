import { useUser } from "@/components/Layout/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Profile = () => {
  const { user } = useUser()
  return (
    <>
      {user && (
        <div className="flex flex-col items-center">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback>{user.name.at(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{user.name}</h1>
        </div>
      )}
    </>
  )
}

export default Profile
