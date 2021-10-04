import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { loadConfigSync } from '../../../_util/config-loader.js'
import { registerAboutPage } from './about-page.js'

describe('AboutPage', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    const config = loadConfigSync('config/raysoda-test.json')
    web = Express2.from(config)
    registerAboutPage(web)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
  })

  it('/about', async () => {
    await sat.get('/about').expect(200).expect(/<title>About/)
  })
  it('/company', async () => {
    await sat.get('/company').expect(200).expect(/<title>Company/)
  })
  it('/ad', async () => {
    await sat.get('/ad').expect(200).expect(/<title>Advertise/)
  })
  it('/privacy', async () => {
    await sat.get('/privacy').expect(200).expect(/<title>Privacy/)
  })
  it('/help', async () => {
    await sat.get('/help').expect(200).expect(/<title>Help/)
  })

})
