import { User } from './user.js'

export type UserView = {
  id: number
  name: string
  home: string
  //email: string
  //hash: string
  status: 'v' | 'd'
  admin: boolean
  profile: string
  cdate: Date | number
  adate: Date | number
  pdate: Date | number
}

export function newUserView(user: User): UserView {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    status: user.status,
    admin: user.admin,
    cdate: user.cdate,
    adate: user.adate,
    pdate: user.pdate,
    profile: user.profile
  }
}

export function userViewDateToTime(user: UserView) {
  user.cdate = (user.cdate as Date).getTime()
  user.adate = (user.adate as Date).getTime()
  user.pdate = (user.pdate as Date).getTime()
}

export function userViewTimeToDate(user: UserView) {
  user.cdate = new Date(user.cdate as number)
  user.adate = new Date(user.adate as number)
  user.pdate = new Date(user.pdate as number)
}

export type UserForList = {
  id: number
  name: string
  home: string
}
