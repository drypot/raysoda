import { SuperAgentTest } from 'supertest'

export interface UserLoginForm {
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
  return request.post('/api/user/login').send(form).expect(200)
}

export async function logoutForTest(request: SuperAgentTest) {
  return request.post('/api/user/logout').expect(200)
}
