import { Express2 } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useAboutPage } from '@server/web/about/page/about-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('AboutPage', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    web = await omanGetObject('Express2') as Express2
    await useAboutPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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
