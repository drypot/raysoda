import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useAboutPage } from '@server/domain/about/page/about-page'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'

describe('AboutPage', () => {

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    web = await getObject('Express2') as Express2
    await useAboutPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
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
