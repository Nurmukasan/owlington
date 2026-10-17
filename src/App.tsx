import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireRole } from './auth/RequireRole'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Landing from './pages/landing/Landing'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/student/ProfilePage'
import SectionPage from './pages/student/SectionPage'
import StudentHome from './pages/student/StudentHome'
import StudentLayout from './pages/student/StudentLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/student"
            element={
              <RequireRole role="student">
                <StudentLayout />
              </RequireRole>
            }
          >
            <Route index element={<StudentHome />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path=":section" element={<SectionPage />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <RequireRole role="teacher">
                <TeacherDashboard />
              </RequireRole>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
