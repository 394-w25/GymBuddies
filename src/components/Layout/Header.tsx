import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  isLoggedIn: boolean
  userImage?: string
  userName?: string
}

const Header = ({ isLoggedIn, userImage, userName }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">GymBuddies</h1>
      {isLoggedIn ? (
        <Avatar>
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback>{userName?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <Button>Login</Button>
      )}
    </header>
  )
}

export default Header
