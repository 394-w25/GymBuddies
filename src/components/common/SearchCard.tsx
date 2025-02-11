import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { memo } from "react"
import * as React from "react"
import { fuzzySearch } from "@/lib/fuzzy_search"
import UserDisplayFollowCard from "./UserDisplayFollowCard"

type Props = {
  currentKnownUsers: User[]
}

type UserScore = {
  user: User
  score: number
}

function sort_by_score(a: UserScore, b: UserScore) {
  return a.score - b.score
}

function useSearchCard({ currentKnownUsers }: Props) {
  const [userList, setUserList] = useState<User[]>([])
  const [searchValue, setSearchValue] = useState<string>("")
  const scoreMin = 2

  useEffect(() => {
    setUserList(currentKnownUsers || [])
  }, [currentKnownUsers])

  function parse_users(search_term: string) {
    const users_and_scores = []

    if (search_term.length > 2) {
      for (const user of currentKnownUsers) {
        if (user.name !== undefined) {
          const diff_and_dist = fuzzySearch(
            user.name?.toLowerCase(),
            search_term.toLowerCase()
          )
          const score =
            diff_and_dist.distance + Math.abs(diff_and_dist.position)

          if (score < scoreMin) {
            users_and_scores.push({ user, score })
          }
        }
      }

      const displayedUsers = users_and_scores
        .sort(sort_by_score)
        .map((element) => element.user as User)

      setUserList(displayedUsers)
    } else {
      for (const user of currentKnownUsers) {
        if (user.name?.toLowerCase().startsWith(search_term)) {
          users_and_scores.push(user as User)
        }
      }
      setUserList(users_and_scores)
    }
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const search_term = event.target.value
    setSearchValue(search_term)

    parse_users(search_term)
  }

  return (
    <div>
      <Dialog
        onOpenChange={() => {
          setSearchValue("")
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full px-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95%]">
          {/* <DialogHeader className="text-start font-semibold">Search Users</DialogHeader> */}
          <DialogTitle>Search Users</DialogTitle>
          <DialogDescription>Find other users to follow...</DialogDescription>
          <Input
            type="search"
            placeholder="John Doe"
            value={searchValue}
            onChange={handleSearchChange}
          />

          <div className="list-of-known-users-matching-search flex flex-col mt-3 gap-1 py-1 border border-gray-200 bg-gray-100 rounded-md justify-start items-center max-h-[30vh] overflow-x-hidden overflow-y-scroll">
            {userList.map((user, key) => (
              <UserDisplayFollowCard displayedUser={user} key={key} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const SearchCard = memo(useSearchCard, (prevProps, nextProps) => {
  return (
    JSON.stringify(prevProps.currentKnownUsers) ===
    JSON.stringify(nextProps.currentKnownUsers)
  )
})

export default SearchCard
