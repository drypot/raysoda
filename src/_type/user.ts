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

export type SessionUser = {
  id: number
  name: string
  home: string
  admin: boolean
}

export function newSessionUser(user: User): SessionUser {
  return { id: user.id, name: user.name, home: user.home, admin: user.admin }
}

export type UserDetail = {
  id: number
  name: string
  home: string
  email: string
  //hash: string
  status: 'v' | 'd'
  admin: boolean
  profile: string
  cdate: Date
  adate: Date
  pdate: Date
}

export function newUserDetail(user: User): UserDetail {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    email: user.email,
    status: user.status,
    admin: user.admin,
    cdate: user.cdate,
    adate: user.adate,
    pdate: user.pdate,
    profile: user.profile
  }
}

export type UserDetailMin = {
  id: number
  name: string
  home: string
}
