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

export type UserLoginForm = {
  email: string
  password: string
  remember: boolean
}

export type UserUpdateForm = {
  id: number
  name: string
  home: string
  email: string
  profile: string
}

export type UserUpdatePasswordForm = {
  id: number
  password: string
}

export type UserUpdateStatusForm = {
  id: number
  status: 'v' | 'd'
}

