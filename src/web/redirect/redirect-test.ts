import { Config, configFrom } from '../../config/config.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerRedirectView } from './redirect.js'

describe('Redirect', () => {

  let config: Config
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    web = await Express2.from(config).start()
    registerRedirectView(web)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
  })

  describe('redirecting', () => {
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
  })

})
