import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireRole } from './auth/RequireRole'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Landing from './pages/landing/Landing'
import NotFound from './pages/NotFound'
import ProfilePage from './pages/student/ProfilePage'
import StudentHome from './pages/student/StudentHome'
import StudentLayout from './pages/student/StudentLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'

// Each section is its own world, loaded on demand.
const ReadingHub = lazy(() => import('./pages/student/reading/ReadingHub'))
const ReadingLecture = lazy(() => import('./pages/student/reading/ReadingLecture'))
const ReadingPractice = lazy(() => import('./pages/student/reading/ReadingPractice'))
const ListeningHub = lazy(() => import('./pages/student/listening/ListeningHub'))
const ListeningLecture = lazy(() => import('./pages/student/listening/ListeningLecture'))
const ListeningPractice = lazy(() => import('./pages/student/listening/ListeningPractice'))
const WritingHub = lazy(() => import('./pages/student/writing/WritingHub'))
const WritingLecture = lazy(() => import('./pages/student/writing/WritingLecture'))
const WritingPractice = lazy(() => import('./pages/student/writing/WritingPractice'))

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

            <Route path="reading" element={<ReadingHub />} />
            <Route path="reading/lecture/:lectureId" element={<ReadingLecture />} />
            <Route path="reading/practice/:practiceId" element={<ReadingPractice />} />

            <Route path="listening" element={<ListeningHub />} />
            <Route path="listening/lecture/:lectureId" element={<ListeningLecture />} />
            <Route path="listening/practice/:practiceId" element={<ListeningPractice />} />

            <Route path="writing" element={<WritingHub />} />
            <Route path="writing/lecture/:lectureId" element={<WritingLecture />} />
            <Route path="writing/practice/:practiceId" element={<WritingPractice />} />

            <Route path="*" element={<Navigate to="/student" replace />} />
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
