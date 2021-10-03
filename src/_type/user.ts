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

export function newUser(params?: Partial<User>): User {
  return {
    id: 0,
    name: '',
    home: '',
    email: '',
    hash: '',
    status: 'v',
    admin: false,
    profile: '',
    cdate: dateNull,
    adate: dateNull,
    pdate: dateNull,
    ...params
  }
}

export function newGuest() {
  return newUser({ id: -1 })
}

export function userIsGuest(user: { id: number }) {
  return user.id === -1
}

export function userIsUser(user: { id: number }) {
  return user.id !== -1
}

export function userIsAdmin(user: { admin: boolean }) {
  return user.admin
}
