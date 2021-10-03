import { SuperAgentTest } from 'supertest'
import { UserLoginForm } from '../../../_type/user-form.js'

export async function loginForTest(request: SuperAgentTest, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await request.post('/api/login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function logoutForTest(request: SuperAgentTest) {
  await request.post('/api/logout').expect(200)
}
