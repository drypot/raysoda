export type UserRegisterForm = {
  name: string
  email: string
  password: string
}

export type UserUpdateForm = {
  name: string
  home: string
  email: string
  password: string
  profile: string
}

export function newUserRegisterForm(params?: Partial<UserRegisterForm>): UserRegisterForm {
  return {
    name: '',
    email: '',
    password: '',
    ...params
  }
}

export function newUserUpdateForm(params?: Partial<UserUpdateForm>): UserUpdateForm {
  return {
    name: '',
    home: '',
    email: '',
    password: '',
    profile: '',
    ...params
  }
}
