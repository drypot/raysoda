import { SuperAgentTest } from 'supertest'
import { UserLoginForm } from '../../../_type/user-form.js'

export const User1Login = { email: 'user1@mail.test', password: '1234', remember: false }
export const User2Login = { email: 'user2@mail.test', password: '1234', remember: false }
export const User3Login = { email: 'user3@mail.test', password: '1234', remember: false }
export const AdminLogin = { email: 'admin@mail.test', password: '1234', remember: false }

export async function loginForTest(request: SuperAgentTest, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await request.post('/api/login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function logoutForTest(request: SuperAgentTest) {
  await request.post('/api/logout').expect(200)
}
