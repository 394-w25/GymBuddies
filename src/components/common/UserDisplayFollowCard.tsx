import { followUser } from "@/lib/db";
import { User } from "@/types/user";
import { useState } from "react";
import { useUser } from "../Layout/UserContext";

type Props = {
    displayedUser : User;
}

export default function UserDisplayFollowCard({displayedUser}: Props) {

    const {user} = useUser();
    // console.log(user?.userId);
    const [userFollowingLocal, setUserFollowingLocal] = useState<string[]>(user?.following || []);


    function handleFollow() {
        if (user?.userId) {
            console.log(`${user.userId} attempting to follow ${displayedUser.userId}`);
            followUser(user.userId, displayedUser.userId);
        }

        setUserFollowingLocal((prev) => (
            [...prev, displayedUser.userId]
        ));

    }

  return (
    <div className="display-user-with-follow-button flex justify-between items-center min-h-[60px] overflow-hidden px-3 py-1 bg-background w-full">
        <div className="user-profile-picture w-[10%] object-scale-down">
            <img className="rounded-full object-scale-down" src={displayedUser.profilePic} />
        </div>

        <div className="user-name min-w-[60%]  overflow-hidden overflow-ellipsis -ml-5 ">
            <h1 className="text-start  overflow-ellipsis">{displayedUser.name}</h1>
        </div>

        { (user && !userFollowingLocal.includes(displayedUser.userId)) 
            ?
            <div className="follow-button w-[12%] py-1 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-100 " onClick={handleFollow}>
                <svg className="scale-[0.55] ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                    <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/>
                </svg>
            </div>
            :
            <div className="nothing w-[1/4]">
                
            </div>
        }

    </div>
  )
}