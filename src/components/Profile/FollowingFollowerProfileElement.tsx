import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../ui/dialog";
import UserList from "./UserList";
type friendsData = {
    following : string[];
    followers : string[];
}

type Props = {
    friends : friendsData;
}

export default function FollowingFollowerProfileElement({friends}: Props) {

    

  return (
    <div className="follower-following flex flex-row w-full gap-10 justify-center items-center">

        {/* FOLLOWERS CARD */}
        <Dialog>
            <DialogTrigger asChild>
                <p className="cursor-pointer">
                    <span className="font-bold">
                        {friends.followers.length}
                    </span>{" "}
                    Followers
                </p>
            </DialogTrigger>

            <DialogContent className="w-[90%] rounded-2xl">
                <DialogTitle>Followers</DialogTitle>
                <UserList userIds={friends.followers} />
            </DialogContent>
        </Dialog>

        <Dialog>
            <DialogTrigger asChild>
                <p className="">
                    <span className="font-bold">
                        {friends.following.length}
                    </span>{" "}
                    Following
                </p>
            </DialogTrigger>

            <DialogContent className="w-[90%] rounded-2xl">
                <DialogTitle>Following</DialogTitle>
                <UserList userIds={friends.following} following={true} />
            </DialogContent>
        </Dialog>

        

    </div>
  )
}