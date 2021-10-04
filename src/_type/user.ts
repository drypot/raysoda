import { dateNull } from '../_util/date2.js'

export type User = {
  id: number
  name: string
  home: string
  email: string
  hash: string
  status: 'v' | 'd'
  admin: boolean
  profile: string
  cdate: Date
  adate: Date
  pdate: Date
}

export function newUser(user: Partial<User>): User {
  return {
    id: user.id ?? 0,
    name: user.name ?? '',
    home: user.home ?? '',
    email: user.email ?? '',
    hash: user.hash ?? '',
    status: user.status ?? 'v',
    admin: user.admin ?? false,
    profile: user.profile ?? '',
    cdate: user.cdate ?? dateNull,
    adate: user.adate ?? dateNull,
    pdate: user.pdate ?? dateNull,
  }
}

export function userIsUser(user: { id: number }) {
  return user.id !== -1
}

export function userIsAdmin(user: { admin: boolean }) {
  return user.admin
}
