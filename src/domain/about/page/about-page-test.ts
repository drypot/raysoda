import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import { useAboutPage } from './about-page.js'

describe('AboutPage', () => {

  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    express2 = await getExpress2()
    await useAboutPage()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('/about', async () => {
    await agent.get('/about').expect(200).expect(/<title>About/)
  })
  it('/company', async () => {
    await agent.get('/company').expect(200).expect(/<title>Company/)
  })
  it('/ad', async () => {
    await agent.get('/ad').expect(200).expect(/<title>Advertise/)
  })
  it('/privacy', async () => {
    await agent.get('/privacy').expect(200).expect(/<title>Privacy/)
  })
  it('/help', async () => {
    await agent.get('/help').expect(200).expect(/<title>Help/)
  })

})
