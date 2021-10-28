export type PasswordMailLog = {
  id: number
  email: string
  random: string
  cdate: Date
}

export type NewPasswordForm = {
  id: number
  random: string
  password: string
}
