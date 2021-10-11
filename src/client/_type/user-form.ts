export type UserRegisterForm = {
  name: string
  email: string
  password: string
}

export function newUserRegisterForm(form: Partial<UserRegisterForm>): UserRegisterForm {
  return {
    name: form.name ?? '',
    email: form.email ?? '',
    password: form.password ?? '',
  }
}

export type UserUpdateForm = {
  name: string
  home: string
  email: string
  password: string
  profile: string
}

export function newUserUpdateForm(user: Partial<UserUpdateForm>): UserUpdateForm {
  return {
    name: user.name ?? '',
    home: user.home ?? '',
    email: user.email ?? '',
    password: user.password ?? '',
    profile: user.profile ?? '',
  }
}

export type UserLoginForm = {
  email: string
  password: string
  remember: boolean
}
