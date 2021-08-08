export interface User {
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

export function newUser(_user?: Object): User {
  const now = new Date()
  return {
    id: 0,
    name: '',
    home: '',
    email: '',
    hash: '',
    status: 'v',
    admin: false,
    profile: '',
    cdate: now,
    adate: now,
    pdate: new Date(2000, 0, 1),
    ..._user
  }
}

