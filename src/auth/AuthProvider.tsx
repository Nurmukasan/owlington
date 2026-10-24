import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
import * as api from './mockAuthApi'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(api.currentUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const loggedIn = await api.login(email, password)
        setUser(loggedIn)
        return loggedIn
      },
      logout: () => {
        api.logout()
        setUser(null)
      },
      updateProfile: async (changes) => {
        if (!user) throw new api.AuthError('Please log in first.')
        const updated = await api.updateProfile(user.id, changes)
        setUser(updated)
        return updated
      },
      changePassword: async (current, next) => {
        if (!user) throw new api.AuthError('Please log in first.')
        await api.changePassword(user.id, current, next)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
