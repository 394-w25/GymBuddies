import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import type { User } from "@/types/user"
import { auth } from "@/lib/firebase"
import { getUser } from "@/lib/db"
import { signInWithGoogle } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface UserContextType {
  user: User | null
  loading: boolean
  handleSignIn: () => Promise<boolean>
  handleSignOut: () => Promise<void>
  refreshUser : () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  handleSignIn: async () => false,
  handleSignOut: async () => {},
  refreshUser: async () => {},
})

// Hook for user context
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext)

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      if (firebaseUser) {
        try {
          const profile = await getUser(firebaseUser.uid)
          if (profile) {

            setUser(profile as User)
            // console.log(`USER : ${JSON.stringify(profile)}`)

          } else {
            console.error("Could not fetch user profile, logging out")
            await handleSignOut()
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          await handleSignOut()
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  async function refreshUser() {
    try {
      if (!user) {
        throw new Error("Cannot refresh without user already logged in.");
      } else {
        const u = await getUser(user.userId);
        setUser(u as User);
      }

    } catch (err) {
      console.error("Error fetching user profile:", err)
      await handleSignOut()
    }
  }

  const handleSignIn = async () => {
    const userData = await signInWithGoogle()
    if (userData) {
      setUser(userData as User)
      return true
    }
    return false
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Error during sign-out:", error)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        handleSignIn,
        handleSignOut,
        refreshUser,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  )
}

export default UserContextProvider
