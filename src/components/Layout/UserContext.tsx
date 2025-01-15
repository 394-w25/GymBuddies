import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import type { User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUser } from "@/lib/db"
import { signInWithGoogle } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface UserContextType {
  user: FirebaseUser | null
  loading: boolean
  handleSignIn: () => Promise<boolean>
  handleSignOut: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  handleSignIn: async () => false,
  handleSignOut: async () => {},
})

// Hook for user context
export const useUser = () => useContext(UserContext)

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true) // Optional: Ensures loading starts on auth state change
      if (firebaseUser) {
        try {
          const profile = await getUser(firebaseUser.uid)
          if (profile) {
            setUser({ ...firebaseUser, ...profile })
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

    return unsubscribe // Cleaner cleanup
  }, [])

  const handleSignIn = async () => {
    const userData = await signInWithGoogle()
    if (userData) {
      setUser(userData)
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
      }}
    >
      {loading ? <Spinner size="large" /> : children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
