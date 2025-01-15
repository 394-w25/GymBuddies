export interface User {
  userId: string
  name: string
  profilePic: string
  friends?: string[]
  status: string
  bio: string
  streak: number
  workouts?: string[]
}
