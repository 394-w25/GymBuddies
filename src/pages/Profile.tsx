import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Profile = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-8">
      <Avatar className="w-32 h-32 mb-4">
        <AvatarImage src="src/assets/blank-pfp.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold">Name</h1>
    </div>
  
  )
  
}

export default Profile
