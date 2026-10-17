import { createContext, useContext } from 'react'
import type { RegisterInput, Role, User } from './mockAuthApi'

export interface AuthContextValue {
  user: User | null
  register: (input: RegisterInput) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/** The signed-in user. Only call this inside a <RequireRole> route. */
export function useUser() {
  const { user } = useAuth()
  if (!user) throw new Error('useUser called without a signed-in user')
  return user
}

export const homeFor = (role: Role) => (role === 'student' ? '/student' : '/teacher')
