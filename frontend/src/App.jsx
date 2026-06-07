import {
  Routes,
  Route
} from "react-router-dom"

import ProtectedRoute from "./components/ProtectedRoute"

// PUBLIC
import Home from "./pages/public/Home"
import Login from "./pages/public/Login"
import Register from "./pages/public/Register"

// STUDENT
import StudentDashboard from "./pages/student/Dashboard"
import Courses from "./pages/student/Courses"
import Conferences from "./pages/student/Conferences"
import Certificates from "./pages/student/Certificates"
import Downloads from "./pages/student/Downloads"
import Profile from "./pages/student/Profile"

// TEACHER
import DashboardTeacher from "./pages/teacher/Dashboard"
import CoursesTeacher from "./pages/teacher/Courses"
import ConferencesTeacher from "./pages/teacher/Conferences"
import ProfileTeacher from "./pages/teacher/Profile"
import AddCourse from "./pages/teacher/AddCourse"
import CreateConference from "./pages/teacher/CreateConference"

// ADMIN
import AdminDashboard from "./pages/admin/Dashboard"
import Users from "./pages/admin/Users"
import CreateUser from "./pages/admin/CreateUser"
import CoursesAdmin from "./pages/admin/Courses"
import ConferencesAdmin from "./pages/admin/Conferences"

function App() {

  return (

    <Routes>

      {/* PUBLIC */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ADMIN */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-create-user"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-courses"
        element={
          <ProtectedRoute>
            <CoursesAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-conferences"
        element={
          <ProtectedRoute>
            <ConferencesAdmin />
          </ProtectedRoute>
        }
      />


      {/* ENSEIGNANT */}
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute>
            <DashboardTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-courses"
        element={
          <ProtectedRoute>
            <CoursesTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-conferences"
        element={
          <ProtectedRoute>
            <ConferencesTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-profile"
        element={
          <ProtectedRoute>
            <ProfileTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-add-course"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher-create-conference"
        element={
          <ProtectedRoute>
            <CreateConference />
          </ProtectedRoute>
        }
      />


      {/* STUDENT */}
      <Route
  path="/student-dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-courses"
  element={
    <ProtectedRoute>
      <Courses />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-conferences"
  element={
    <ProtectedRoute>
      <Conferences />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-certificates"
  element={
    <ProtectedRoute>
      <Certificates />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-downloads"
  element={
    <ProtectedRoute>
      <Downloads />
    </ProtectedRoute>
  }
/>

<Route
  path="/student-profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

    </Routes>

  )
}

export default App