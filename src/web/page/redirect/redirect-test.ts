import { configFrom } from '../../../_util/config-loader.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerRedirect } from './redirect.js'
import { Config } from '../../../_type/config.js'

describe('Redirect', () => {

  let config: Config
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    registerRedirect(web)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  it('/Com/Photo/View.aspx', async () => {
    await request.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928')
      .expect(301).expect('Location', '/image/937928')
  })
  it('/Com/Photo/List.aspx', async () => {
    await request.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3')
      .expect(301).expect('Location', '/')
  })

  it('/Com/Photo/CList.aspx', async () => {
    await request.get('/Com/Photo/CList.aspx?f=C')
      .expect(301).expect('Location', '/')
  })
  it('/users', async () => {
    await request.get('/users/1')
      .expect(301).expect('Location', '/user/1')
  })
  it('/images', async () => {
    await request.get('/images/1')
      .expect(301).expect('Location', '/image/1')
  })

  it('/user1', async () => {
    const res = await request.get('/user1').expect(301).expect('Location', '/user/user1')
  })
  it('/USER1', async () => {
    const res = await request.get('/USER1').expect(301).expect('Location', '/user/USER1')
  })
  it('/xman', async () => {
    const res = await request.get('/xman').expect(301).expect('Location', '/user/xman')
  })
  it('/xman/yman', async () => {
    const res = await request.get('/xman/yman').expect(404)
  })
  it('/xman/yman encoded', async () => {
    const res = await request.get('/' + encodeURIComponent('xman/yman'))
      .expect(301).expect('Location', '/user/' + encodeURIComponent('xman/yman'))
  })

})
