import { User } from './user.js'

export type SessionUser = {
  id: number
  name: string
  home: string
  admin: boolean
}

export function newSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    admin: user.admin
  }
}
