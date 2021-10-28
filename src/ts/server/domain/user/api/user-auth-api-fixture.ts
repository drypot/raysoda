import { SuperAgentTest } from 'supertest'
import { UserLoginForm } from '@common/type/user-form'

export async function userLoginForTest(sat: SuperAgentTest, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await sat.post('/api/user-login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function userLogoutForTest(sat: SuperAgentTest) {
  await sat.post('/api/user-logout').expect(200)
}
