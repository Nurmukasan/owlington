import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { homeFor, useAuth } from './auth-context'
import type { Role } from './mockAuthApi'

/** Only lets users with the given role through; everyone else is redirected. */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return children
}
