import { followUser, unfollowUser } from "@/lib/db"
import { User } from "@/types/user"
import { useState, useEffect } from "react"
import { useUser } from "../Layout/UserContext"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Check } from "lucide-react"
import { listenToFollowingChanged } from "@/lib/db"
import { Link } from "react-router"

type Props = {
  displayedUser: User
}

export default function UserDisplayFollowCard({ displayedUser }: Props) {
  const { user } = useUser()
  const [userFollowingLocal, setUserFollowingLocal] = useState<string[]>(
    user?.following || []
  )

  useEffect(() => {
    if (user) {
      const unsubscribe = listenToFollowingChanged(user.userId, (following) =>
        setUserFollowingLocal(following)
      )

      return () => unsubscribe()
    }
  }, [user])

  const handleFollow = async () => {
    if (!user) return

    const success = await followUser(user.userId, displayedUser.userId)
    if (success) {
      setUserFollowingLocal((prev) => [...prev, displayedUser.userId])
    }
  }

  const handleUnfollow = async () => {
    if (!user) return

    const success = await unfollowUser(user.userId, displayedUser.userId)
    if (success) {
      setUserFollowingLocal((prev) =>
        prev.filter((uid) => uid !== displayedUser.userId)
      )
    }
  }

  return (
    <div className="display-user-with-follow-button flex justify-between items-center min-h-[60px] overflow-hidden px-3 py-1 bg-background w-full">
      <Link to={`profile/${displayedUser?.userId}`}>
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={`${displayedUser?.profilePic}`}
              alt={`${displayedUser?.name}`}
            />
            <AvatarFallback>
              {displayedUser?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1>{displayedUser.name}</h1>
        </div>
      </Link>

      {user && !userFollowingLocal.includes(displayedUser.userId) ? (
        <Button variant="outline" onClick={handleFollow}>
          Follow
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>
              <Check />
              Following
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Unfollow {displayedUser.name}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want unfollow?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUnfollow}>
                Unfollow
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
