import { useUser } from "./UserContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Header = () => {
  const { user, handleSignIn } = useUser()

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">GymBuddies</h1>
      {user ? (
        <Avatar>
          <AvatarImage src={user.profilePic} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <Button onClick={handleSignIn}>Login</Button>
      )}
    </header>
  )
}

export default Header
