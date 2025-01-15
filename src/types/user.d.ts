export interface User {
  userId: string
  name: string
  profilePic: string
  friends?: string[]
  status: boolean
  bio: string
  streak: number
  workouts?: string[]
}
