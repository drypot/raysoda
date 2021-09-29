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

export function userOf(params?: Partial<User>): User {
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

export type UserMin = {
  id: number
  name: string
  home: string
  admin: boolean
}

export function userMinOf(user: User) {
  return { id: user.id, name: user.name, home: user.home, admin: user.admin }
}
