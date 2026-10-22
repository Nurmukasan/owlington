/**
 * TEMPORARY front-end-only auth.
 *
 * Accounts live in this browser's localStorage so we can build and click
 * through the product before the real backend exists. Swap these functions
 * for API calls later — the rest of the app only talks to `AuthProvider`.
 */

export type Role = 'student' | 'teacher'

/** A pixel owlet in one of the preset feather colours, or an uploaded photo (a small data URL). */
export type AvatarChoice = { kind: 'owl'; feathers: number } | { kind: 'photo'; src: string }

export interface User {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  avatar?: AvatarChoice
}

export interface ProfileChanges {
  name?: string
  email?: string
  /** null removes a custom avatar. */
  avatar?: AvatarChoice | null
  /** Required when the email changes (the password hash is tied to the email). */
  password?: string
}

interface StoredUser extends User {
  passwordHash: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: Role
}

export class AuthError extends Error {}

const USERS_KEY = 'owlington:users'
const SESSION_KEY = 'owlington:session'

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? (JSON.parse(raw) as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const toUser = ({ id, name, email, role, createdAt, avatar }: StoredUser): User => ({
  id,
  name,
  email,
  role,
  createdAt,
  ...(avatar ? { avatar } : {}),
})

const normalizeEmail = (email: string) => email.trim().toLowerCase()

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`owlington:${email}:${password}`)
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  // Insecure contexts (plain http on a LAN IP) have no SubtleCrypto; fall back to FNV-1a.
  let h = 0x811c9dc5
  for (const byte of data) h = Math.imul(h ^ byte, 0x01000193)
  return (h >>> 0).toString(16)
}

const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export async function register(input: RegisterInput): Promise<User> {
  const email = normalizeEmail(input.email)
  const users = readUsers()
  if (users.some((u) => u.email === email)) {
    throw new AuthError('An account with this email already exists. Try logging in instead.')
  }
  const stored: StoredUser = {
    id: newId(),
    name: input.name.trim(),
    email,
    role: input.role,
    createdAt: new Date().toISOString(),
    passwordHash: await hashPassword(email, input.password),
  }
  writeUsers([...users, stored])
  localStorage.setItem(SESSION_KEY, stored.id)
  return toUser(stored)
}

export async function login(rawEmail: string, password: string): Promise<User> {
  const email = normalizeEmail(rawEmail)
  const user = readUsers().find((u) => u.email === email)
  if (!user || user.passwordHash !== (await hashPassword(email, password))) {
    throw new AuthError('That email and password don’t match. Give it another try.')
  }
  localStorage.setItem(SESSION_KEY, user.id)
  return toUser(user)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD = 8

export async function updateProfile(id: string, changes: ProfileChanges): Promise<User> {
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new AuthError('Your session has expired. Please log in again.')
  const next: StoredUser = { ...user }

  if (changes.name !== undefined) {
    const name = changes.name.trim()
    if (!name) throw new AuthError('Your name can’t be empty.')
    next.name = name
  }

  if (changes.email !== undefined) {
    const email = normalizeEmail(changes.email)
    if (email !== user.email) {
      if (!EMAIL_RE.test(email)) throw new AuthError('That doesn’t look like an email address.')
      if (users.some((u) => u.id !== id && u.email === email)) {
        throw new AuthError('Another account already uses this email.')
      }
      if (!changes.password || user.passwordHash !== (await hashPassword(user.email, changes.password))) {
        throw new AuthError('Enter your current password to change your email.')
      }
      next.email = email
      next.passwordHash = await hashPassword(email, changes.password)
    }
  }

  if (changes.avatar === null) delete next.avatar
  else if (changes.avatar) next.avatar = changes.avatar

  try {
    writeUsers(users.map((u) => (u.id === id ? next : u)))
  } catch {
    throw new AuthError('Couldn’t save your changes — the photo may be too large. Try a smaller one.')
  }
  return toUser(next)
}

export async function changePassword(id: string, current: string, password: string) {
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new AuthError('Your session has expired. Please log in again.')
  if (user.passwordHash !== (await hashPassword(user.email, current))) {
    throw new AuthError('Your current password isn’t right.')
  }
  if (password.length < MIN_PASSWORD) {
    throw new AuthError(`Your new password needs at least ${MIN_PASSWORD} characters.`)
  }
  const passwordHash = await hashPassword(user.email, password)
  writeUsers(users.map((u) => (u.id === id ? { ...u, passwordHash } : u)))
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function currentUser(): User | null {
  try {
    const id = localStorage.getItem(SESSION_KEY)
    const user = id ? readUsers().find((u) => u.id === id) : undefined
    return user ? toUser(user) : null
  } catch {
    return null
  }
}
