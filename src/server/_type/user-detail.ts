import { User } from './user'

export type UserDetail = {
  id: number
  name: string
  home: string
  //email: string
  //hash: string
  status: 'v' | 'd'
  admin: boolean
  profile: string
  cdate: Date
  adate: Date
  pdate: Date
  cdateNum: number
  adateNum: number
  pdateNum: number
}

export function newUserDetail(user: User): UserDetail {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    status: user.status,
    admin: user.admin,
    profile: user.profile,
    cdate: user.cdate,
    adate: user.adate,
    pdate: user.pdate,
    cdateNum: 0,
    adateNum: 0,
    pdateNum: 0,
  }
}

export function packUserDetail(user: UserDetail) {
  user.cdateNum = user.cdate.getTime()
  user.adateNum = user.adate.getTime()
  user.pdateNum = user.pdate.getTime()
}

export function unpackUserDetail(user: UserDetail) {
  user.cdate = new Date(user.cdateNum)
  user.adate = new Date(user.adateNum)
  user.pdate = new Date(user.pdateNum)
}

export type UserForList = {
  id: number
  name: string
  home: string
}
