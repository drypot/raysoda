import { SuperAgentTest } from 'supertest'
import { UserLoginForm } from '../../../../_type/user-form'

export async function loginForTest(sat: SuperAgentTest, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await sat.post('/api/login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function logoutForTest(sat: SuperAgentTest) {
  await sat.post('/api/logout').expect(200)
}
