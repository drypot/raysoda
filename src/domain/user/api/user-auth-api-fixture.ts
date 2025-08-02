import supertest from 'supertest'
import { UserLoginForm } from '../../../common/type/user-form.js'

export async function userLoginForTest(agent: supertest.Agent, _form: UserLoginForm, remember: boolean = false) {
  const form = { ..._form, remember }
  const res = await agent.post('/api/user-login').send(form).expect(200)
  if (res.body.err) throw res.body.err
}

export async function userLogoutForTest(agent: supertest.Agent) {
  await agent.post('/api/user-logout').expect(200)
}
