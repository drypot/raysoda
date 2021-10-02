import { User } from './user.js'

export type UserView = {
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

export function newUserView(user: User): UserView {
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

export type UserForList = {
  id: number
  name: string
  home: string
}
