export type UserForClient = {
  id: number
  name: string
  home: string
  admin: boolean
}

export function newUserForClient(user: UserForClient): UserForClient {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    admin: user.admin
  }
}
