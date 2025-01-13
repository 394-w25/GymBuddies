import Home from "./pages/Home"
import ExerciseTracker from "./pages/ExerciseTracker"
import Profile from "./pages/Profile"
import { BrowserRouter, Routes, Route } from "react-router"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracker" element={<ExerciseTracker />} />
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
