import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { memo } from "react"


type Props = {
    currentKnownUsers : User[];
}


function unmemoedSearchCard({currentKnownUsers}: Props) {

    const [renderedUserList, setRenderedUserList] = useState<User[]>([]);

    console.log(`KNIWN L:::: ${JSON.stringify(currentKnownUsers)}`);

    useEffect(() => {
        setRenderedUserList(currentKnownUsers || []);
    }, [currentKnownUsers]);
    



  return (
    <div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg></Button>
            </DialogTrigger>

            <DialogContent className="w-[95%]">
                <DialogHeader className="text-start font-semibold">Search Users</DialogHeader>
                <DialogDescription>Find other users to follow...</DialogDescription>
                <Input type="search" placeholder="John Doe" />


                <div className="list-of-known-users-matching-search flex flex-col mt-3 border border-gray-200 rounded-md justify-start items-center max-h-[30vh] overflow-x-hidden overflow-y-scroll">

                    {
                        renderedUserList.map((user, idx) => (
                            <h1 key={user.userId}>{user.name}</h1>
                        ))
                    }

                </div>
            </DialogContent>

        </Dialog>
    </div>

  )
}

const SearchCard = memo(unmemoedSearchCard, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.currentKnownUsers) === JSON.stringify(nextProps.currentKnownUsers);
})

export default SearchCard