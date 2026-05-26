import {
  Routes,
  Route
} from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import AddCourse from "./pages/AddCourse"

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/admin-dashboard" element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
    
  }
/>

<Route path="/teacher-dashboard" element={
    <ProtectedRoute>
      <TeacherDashboard />
    </ProtectedRoute>
  }
/>

<Route path="/student-dashboard" element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/add-course"
  element={<AddCourse />}
/>

    </Routes>
  )
}

export default App