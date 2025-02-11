export interface User {
  userId: string
  name: string
  email: string | null
  profilePic: string
  status: boolean | string
  bio: string
  streak: number
  workouts: string[]
  following: string[]
  followers: string[]
}
