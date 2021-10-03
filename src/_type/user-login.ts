export type LoginUser = {
  id: number
  name: string
  home: string
  admin: boolean
}

export function newLoginUser(user: LoginUser): LoginUser {
  return {
    id: user.id,
    name: user.name,
    home: user.home,
    admin: user.admin
  }
}
