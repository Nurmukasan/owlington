/**
 * TEMPORARY front-end-only accounts.
 *
 * Accounts live in this browser's localStorage so we can build and click
 * through the product before the real backend exists. Swap these functions
 * for API calls later — the rest of the app only talks to `AuthProvider`
 * and the functions exported here.
 *
 * Nobody signs up: the admin creates every student and teacher, and decides
 * which students each teacher looks after.
 */

export type Role = 'student' | 'teacher' | 'admin'

/** A pixel owlet in one of the preset feather colours, or an uploaded photo (a small data URL). */
export type AvatarChoice = { kind: 'owl'; feathers: number } | { kind: 'photo'; src: string }

export interface User {
  id: string
  /** "First Last", kept for everything that shows one name. */
  name: string
  firstName: string
  lastName: string
  email: string
  role: Role
  /** When the account was added to the platform. */
  createdAt: string
  avatar?: AvatarChoice
  phone?: string
  /** Students: the band they are aiming for. */
  targetBand?: number
  /** Admin's notes about the person (level, group, exam date…). */
  notes?: string
  /** Students: the teacher who looks after them. */
  teacherId?: string
  /** Students: the date of their IELTS exam, if booked (YYYY-MM-DD). */
  examDate?: string
}

export interface ProfileChanges {
  firstName?: string
  lastName?: string
  /** Older callers pass a single name; it is split at the first space. */
  name?: string
  email?: string
  phone?: string
  /** null removes a custom avatar. */
  avatar?: AvatarChoice | null
  /** Required when the email changes (the password hash is tied to the email). */
  password?: string
}

/** What the admin fills in to add a person. */
export interface NewAccount {
  role: 'student' | 'teacher'
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  targetBand?: number
  notes?: string
  teacherId?: string
  examDate?: string
}

/** What the admin may change on an existing account (password optional: a reset). */
export type AccountChanges = Partial<Omit<NewAccount, 'role' | 'teacherId'>> & { teacherId?: string | null }

interface StoredUser extends User {
  passwordHash: string
}

export class AuthError extends Error {}

const USERS_KEY = 'owlington:users'
const SESSION_KEY = 'owlington:session'

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const list = raw ? (JSON.parse(raw) as StoredUser[]) : []
    return list.map(upgrade)
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** Accounts saved before first/last names existed. */
function upgrade(u: StoredUser): StoredUser {
  if (u.firstName !== undefined && u.lastName !== undefined) return u
  const [first, ...rest] = (u.name ?? '').trim().split(/\s+/)
  return { ...u, firstName: first ?? '', lastName: rest.join(' ') }
}

const fullName = (first: string, last: string) => [first.trim(), last.trim()].filter(Boolean).join(' ')

function toUser(u: StoredUser): User {
  const { passwordHash: _hash, ...user } = u
  void _hash
  return { ...user, name: fullName(u.firstName, u.lastName) }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase()

export async function hashPassword(email: string, password: string) {
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_PASSWORD = 8

// --- session -------------------------------------------------------------------

export async function login(rawEmail: string, password: string): Promise<User> {
  const email = normalizeEmail(rawEmail)
  const user = readUsers().find((u) => u.email === email)
  if (!user || user.passwordHash !== (await hashPassword(email, password))) {
    throw new AuthError('That email and password don’t match. Give it another try.')
  }
  localStorage.setItem(SESSION_KEY, user.id)
  return toUser(user)
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

function requireRole(...roles: Role[]): User {
  const me = currentUser()
  if (!me || !roles.includes(me.role)) throw new AuthError('You don’t have access to this.')
  return me
}

// --- own profile -----------------------------------------------------------------

export async function updateProfile(id: string, changes: ProfileChanges): Promise<User> {
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  if (!user) throw new AuthError('Your session has expired. Please log in again.')
  const next: StoredUser = { ...user }

  if (changes.name !== undefined) {
    const [first, ...rest] = changes.name.trim().split(/\s+/)
    changes = { ...changes, firstName: first ?? '', lastName: rest.join(' ') }
  }
  if (changes.firstName !== undefined) {
    if (!changes.firstName.trim()) throw new AuthError('Your first name can’t be empty.')
    next.firstName = changes.firstName.trim()
  }
  if (changes.lastName !== undefined) next.lastName = changes.lastName.trim()
  if (changes.phone !== undefined) next.phone = changes.phone.trim() || undefined

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

// --- people ------------------------------------------------------------------------

/** What other students may see of a student: for the weekly leaderboard. */
export type PublicProfile = Pick<User, 'id' | 'name' | 'avatar'>

/** Every student account (on this device, until the backend exists). */
export function listStudents(): PublicProfile[] {
  return readUsers()
    .filter((u) => u.role === 'student')
    .map(toUser)
    .map(({ id, name, avatar }) => ({ id, name, ...(avatar ? { avatar } : {}) }))
}

/** Admin: everyone with a role. */
export function listAccounts(role: 'student' | 'teacher'): User[] {
  requireRole('admin')
  return readUsers()
    .filter((u) => u.role === role)
    .map(toUser)
}

/** Teacher: only the students the admin has given them. Admin: any teacher's students. */
export function listMyStudents(teacherId?: string): User[] {
  const me = requireRole('teacher', 'admin')
  const id = me.role === 'teacher' ? me.id : teacherId
  return readUsers()
    .filter((u) => u.role === 'student' && u.teacherId === id)
    .map(toUser)
}

/** One student, if the signed-in person may see them. */
export function getStudent(id: string): User | null {
  const me = currentUser()
  const s = readUsers().find((u) => u.id === id && u.role === 'student')
  if (!me || !s) return null
  if (me.role === 'admin' || (me.role === 'teacher' && s.teacherId === me.id)) return toUser(s)
  return null
}

/** Name of any teacher (for "your teacher" labels). */
export function teacherName(id: string | undefined): string | null {
  if (!id) return null
  const t = readUsers().find((u) => u.id === id && u.role === 'teacher')
  return t ? toUser(t).name : null
}

function validate(input: { firstName?: string; lastName?: string; email?: string; password?: string; targetBand?: number }, users: StoredUser[], selfId?: string) {
  if (input.firstName !== undefined && !input.firstName.trim()) throw new AuthError('First name is required.')
  if (input.lastName !== undefined && !input.lastName.trim()) throw new AuthError('Last name is required.')
  if (input.email !== undefined) {
    const email = normalizeEmail(input.email)
    if (!EMAIL_RE.test(email)) throw new AuthError('That doesn’t look like an email address.')
    if (users.some((u) => u.email === email && u.id !== selfId)) throw new AuthError('Another account already uses this email.')
  }
  if (input.password !== undefined && input.password.length < MIN_PASSWORD) {
    throw new AuthError(`The password needs at least ${MIN_PASSWORD} characters.`)
  }
  if (input.targetBand !== undefined && !(input.targetBand >= 1 && input.targetBand <= 9)) throw new AuthError('Target band must be between 1 and 9.')
}

function checkTeacher(users: StoredUser[], teacherId: string | null | undefined) {
  if (teacherId && !users.some((u) => u.id === teacherId && u.role === 'teacher')) throw new AuthError('That teacher no longer exists.')
}

/** Admin: add a student or a teacher. */
export async function createAccount(input: NewAccount): Promise<User> {
  const admin = requireRole('admin')
  const users = readUsers()
  validate(input, users)
  checkTeacher(users, input.teacherId)
  const email = normalizeEmail(input.email)
  const stored: StoredUser = {
    id: newId(),
    name: fullName(input.firstName, input.lastName),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email,
    role: input.role,
    createdAt: new Date().toISOString(),
    passwordHash: await hashPassword(email, input.password),
    ...(input.phone?.trim() ? { phone: input.phone.trim() } : {}),
    ...(input.notes?.trim() ? { notes: input.notes.trim() } : {}),
    ...(input.role === 'student' && input.targetBand ? { targetBand: input.targetBand } : {}),
    ...(input.role === 'student' && input.teacherId ? { teacherId: input.teacherId } : {}),
    ...(input.role === 'student' && input.examDate ? { examDate: input.examDate } : {}),
  }
  void admin
  writeUsers([...users, stored])
  return toUser(stored)
}

/** Admin: edit details, reset a password or move a student to another teacher. */
export async function updateAccount(id: string, changes: AccountChanges): Promise<User> {
  requireRole('admin')
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  if (!user || user.role === 'admin') throw new AuthError('That account no longer exists.')
  validate(changes, users, id)
  checkTeacher(users, changes.teacherId)
  const next: StoredUser = { ...user }
  if (changes.firstName !== undefined) next.firstName = changes.firstName.trim()
  if (changes.lastName !== undefined) next.lastName = changes.lastName.trim()
  for (const key of ['phone', 'notes', 'examDate'] as const) {
    const v = changes[key]
    if (v !== undefined) {
      if (v.trim()) next[key] = v.trim()
      else delete next[key]
    }
  }
  if (changes.targetBand !== undefined) next.targetBand = changes.targetBand || undefined
  if (changes.teacherId !== undefined && user.role === 'student') {
    if (changes.teacherId) next.teacherId = changes.teacherId
    else delete next.teacherId
  }
  if (changes.email !== undefined) next.email = normalizeEmail(changes.email)
  // The hash is tied to the email, so a new email needs the password again.
  if (changes.password) next.passwordHash = await hashPassword(next.email, changes.password)
  else if (next.email !== user.email) throw new AuthError('Set a new password when you change the email.')
  next.name = fullName(next.firstName, next.lastName)
  writeUsers(users.map((u) => (u.id === id ? next : u)))
  return toUser(next)
}

/** Admin: give a group of students to a teacher (or take them away with null). */
export function assignStudents(studentIds: string[], teacherId: string | null) {
  requireRole('admin')
  const users = readUsers()
  checkTeacher(users, teacherId)
  const set = new Set(studentIds)
  writeUsers(
    users.map((u) => {
      if (!set.has(u.id) || u.role !== 'student') return u
      const { teacherId: _old, ...rest } = u
      void _old
      return teacherId ? { ...rest, teacherId } : rest
    }),
  )
}

/** Admin: remove an account. A removed teacher's students become unassigned. */
export function deleteAccount(id: string) {
  requireRole('admin')
  const users = readUsers()
  const user = users.find((u) => u.id === id)
  if (!user || user.role === 'admin') throw new AuthError('That account can’t be removed.')
  writeUsers(
    users
      .filter((u) => u.id !== id)
      .map((u) => {
        if (u.teacherId !== id) return u
        const { teacherId: _t, ...rest } = u
        void _t
        return rest
      }),
  )
  try {
    localStorage.removeItem(`owlington:progress:${id}`)
  } catch {
    // ignore
  }
}

// --- seeding (demo accounts) ------------------------------------------------------

export interface SeedAccount extends Omit<NewAccount, 'role' | 'teacherId'> {
  id: string
  role: Role
  createdAt: string
  teacherId?: string
  avatar?: AvatarChoice
}

/** Adds accounts that aren't there yet (matched by email). Used once per seed version. */
export async function addSeedAccounts(accounts: SeedAccount[]) {
  const users = readUsers()
  const have = new Set(users.map((u) => u.email))
  const added: StoredUser[] = []
  for (const a of accounts) {
    const email = normalizeEmail(a.email)
    if (have.has(email)) continue
    const { password, ...rest } = a
    added.push({
      ...rest,
      email,
      name: fullName(a.firstName, a.lastName),
      passwordHash: await hashPassword(email, password),
    })
  }
  if (added.length) writeUsers([...users, ...added])
  return added.map((u) => u.id)
}
