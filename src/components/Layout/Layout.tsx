import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import { Home, Dumbbell, User } from "lucide-react"

const Layout = () => {
  // This is a placeholder for now
  const isLoggedIn = false
  const userName = "John Doe"
  const userImage = "https://github.com/shadcn.png"

  const footerItems = [
    { icon: Home, title: "Home", to: "/" },
    { icon: Dumbbell, title: "Workouts", to: "/workouts" },
    { icon: User, title: "Profile", to: "/profile" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isLoggedIn={isLoggedIn}
        userName={userName}
        userImage={userImage}
      />
      <main className="flex-grow p-6 bg-gray-100">
        <Outlet />
      </main>
      <Footer items={footerItems} />
    </div>
  )
}

export default Layout
