export type UserRegisterForm = {
  email: string
  password: string
}

export function newUserRegisterForm(form: Partial<UserRegisterForm>): UserRegisterForm {
  return {
    email: form.email ?? '',
    password: form.password ?? '',
  }
}

export type UserUpdateForm = {
  id: number
  name: string
  home: string
  email: string
  password: string
  profile: string
}

export function newUserUpdateForm(user: Partial<UserUpdateForm>): UserUpdateForm {
  return {
    id: user.id ?? 0,
    name: user.name ?? '',
    home: user.home ?? '',
    email: user.email ?? '',
    password: user.password ?? '',
    profile: user.profile ?? '',
  }
}

export type UserUpdateStatusForm = {
  id: number
  status: 'v' | 'd'
}

export type UserLoginForm = {
  email: string
  password: string
  remember: boolean
}
