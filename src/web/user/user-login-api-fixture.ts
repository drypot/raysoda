import { SuperAgentTest } from 'supertest'

export type UserLoginForm = {
  email: string
  password: string
  remember?: boolean
}

export const User1Login = { email: 'user1@mail.test', password: '1234' }
export const User2Login = { email: 'user2@mail.test', password: '1234' }
export const User3Login = { email: 'user3@mail.test', password: '1234' }
export const AdminLogin = { email: 'admin@mail.test', password: '1234' }

export async function loginForTest(request: SuperAgentTest, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await request.post('/api/user/login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function logoutForTest(request: SuperAgentTest) {
  await request.post('/api/user/logout').expect(200)
}
