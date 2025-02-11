import { useUser } from "./UserContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Dumbbell, UserCircle2 } from "lucide-react"
import SearchCard from "../common/SearchCard"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { getAllUsers } from "@/lib/db"

const Header = () => {
  const { user, handleSignIn, handleSignOut } = useUser()
  const navigate = useNavigate()
  const [knownUsers, setKnownUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchKnownUsers = async () => {
      const users = await getAllUsers()
      setKnownUsers(users)
    }

    fetchKnownUsers()

    const interval = setInterval(() => {
      fetchKnownUsers()
    }, 60000) // once per minute

    return () => clearInterval(interval)
  }, [user])

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm sticky top-0 z-50 h-[75px]">
      <div
        className="flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => {
          navigate("/")
        }}
      >
        <Dumbbell />
        <h1 className="text-2xl font-bold text-primary">GymBuddies</h1>
      </div>
      {!user ? (
        <Button onClick={handleSignIn}>
          <UserCircle2 />
          Login
        </Button>
      ) : (
        <div className="search-and-user-buttons flex gap-4">
          <SearchCard currentKnownUsers={Object.values(knownUsers)} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user.profilePic} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <AlertDialog>
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogOut />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        await handleSignOut().then(() => navigate("/"))
                      }}
                    >
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  )
}

export default Header
