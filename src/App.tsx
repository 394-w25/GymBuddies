import Feed from "./pages/Feed"
import ExerciseTracker from "./pages/ExerciseTracker"
import Profile from "./pages/Profile"
import { BrowserRouter, Routes, Route } from "react-router"
import "./App.css"
import Layout from "./components/Layout/Layout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="/workouts" element={<ExerciseTracker />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="*"
            element={
              <>
                <h1>404</h1>
                <p>The page you requested does not exist.</p>
              </>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
