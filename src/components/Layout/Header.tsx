import { useUser } from "./UserContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

const Header = () => {
  const { user, handleSignIn, handleSignOut } = useUser()

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-primary">GymBuddies</h1>
      {!user ? (
        <Button onClick={handleSignIn}>Login</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user.profilePic} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}

export default Header
