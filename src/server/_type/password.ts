export type ResetToken = {
  uuid: string
  email: string
  token: string
}

export type NewPasswordForm = {
  uuid: string
  token: string
  password: string
}
