import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import UserContextProvider from "./UserContext"
import { Home, Dumbbell, User } from "lucide-react"

const Layout = () => {
  const footerItems = [
    { icon: Home, title: "Home", to: "/" },
    { icon: Dumbbell, title: "Workouts", to: "/workouts" },
    { icon: User, title: "Profile", to: "/profile" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <UserContextProvider>
        <Header />
        <main className="flex-grow p-6 pt-4 bg-gray-100">
          <Outlet />
        </main>
        <Footer items={footerItems} />
      </UserContextProvider>
    </div>
  )
}

export default Layout
