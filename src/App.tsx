import { lazy, useEffect } from 'react'
import { BrowserRouter, HashRouter, Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireRole } from './auth/RequireRole'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Landing from './pages/landing/Landing'
import NotFound from './pages/NotFound'
import StudentHome from './pages/student/StudentHome'
import StudentLayout from './pages/student/StudentLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'

const Router = import.meta.env.BASE_URL === '/owlington/' ? HashRouter : BrowserRouter

/** New pages start at the top; back/forward and "#section" links keep their own scroll. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()
  useEffect(() => {
    if (navigationType !== 'POP' && !hash) window.scrollTo(0, 0)
  }, [pathname, hash, navigationType])
  return null
}

const ProfilePage = lazy(() => import('./pages/student/profile/ProfilePage'))

// Each section is its own world, loaded on demand.
const ReadingHub = lazy(() => import('./pages/student/reading/ReadingHub'))
const ReadingLectures = lazy(() => import('./pages/student/reading/ReadingLectures'))
const ReadingPracticeList = lazy(() => import('./pages/student/reading/ReadingPracticeList'))
const ReadingLecture = lazy(() => import('./pages/student/reading/ReadingLecture'))
const ReadingPractice = lazy(() => import('./pages/student/reading/ReadingPractice'))
const ListeningHub = lazy(() => import('./pages/student/listening/ListeningHub'))
const ListeningLectures = lazy(() => import('./pages/student/listening/ListeningLectures'))
const ListeningPracticeList = lazy(() => import('./pages/student/listening/ListeningPracticeList'))
const ListeningLecture = lazy(() => import('./pages/student/listening/ListeningLecture'))
const ListeningPractice = lazy(() => import('./pages/student/listening/ListeningPractice'))
const WritingHub = lazy(() => import('./pages/student/writing/WritingHub'))
const WritingLectures = lazy(() => import('./pages/student/writing/WritingLectures'))
const WritingPracticeList = lazy(() => import('./pages/student/writing/WritingPracticeList'))
const WritingLecture = lazy(() => import('./pages/student/writing/WritingLecture'))
const WritingPractice = lazy(() => import('./pages/student/writing/WritingPractice'))

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
            <Route path="reading/lectures" element={<ReadingLectures />} />
            <Route path="reading/practice" element={<ReadingPracticeList />} />
            <Route path="reading/lecture/:lectureId" element={<ReadingLecture />} />
            <Route path="reading/practice/:practiceId" element={<ReadingPractice />} />

            <Route path="listening" element={<ListeningHub />} />
            <Route path="listening/lectures" element={<ListeningLectures />} />
            <Route path="listening/practice" element={<ListeningPracticeList />} />
            <Route path="listening/lecture/:lectureId" element={<ListeningLecture />} />
            <Route path="listening/practice/:practiceId" element={<ListeningPractice />} />

            <Route path="writing" element={<WritingHub />} />
            <Route path="writing/lectures" element={<WritingLectures />} />
            <Route path="writing/practice" element={<WritingPracticeList />} />
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
      </Router>
    </AuthProvider>
  )
}
