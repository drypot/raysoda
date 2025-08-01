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

export type UpdateUserProfileForm = {
  id: number
  name: string
  home: string
  email: string
  profile: string
}

export type UpdateUserPasswordForm = {
  id: number
  password: string
}

export type UpdateUserStatusForm = {
  id: number
  status: 'v' | 'd'
}

