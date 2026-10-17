import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
import * as api from './mockAuthApi'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(api.currentUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      register: async (input) => {
        const created = await api.register(input)
        setUser(created)
        return created
      },
      login: async (email, password) => {
        const loggedIn = await api.login(email, password)
        setUser(loggedIn)
        return loggedIn
      },
      logout: () => {
        api.logout()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
