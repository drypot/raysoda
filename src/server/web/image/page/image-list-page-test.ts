import { DB } from '../../../db/_db/db'
import { UserDB } from '../../../db/user/user-db'
import { ImageDB } from '../../../db/image/image-db'
import { ImageFileManager } from '../../../file/_fileman'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix'
import { useImageListPage } from './image-list-page'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../oman/oman'
import { omanGetImageFileManager } from '../../../file/_fileman-loader'

describe('ImageListPage', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
    web = await omanGetObject('Express2') as Express2
    await useImageListPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  // it('remove image dir', async () => {
  //   await ifm.rmRoot()
  // })
  it('insert fix', async () => {
    const list = [
      [1, 2, new Date(2003, 0, 1), '1'],
      [2, 2, new Date(2003, 1, 2), '2'],
      [3, 2, new Date(2003, 2, 3), '3'],
      [4, 2, new Date(2003, 3, 4), '4'],
      [5, 2, new Date(2003, 4, 5), '5'],
      [6, 1, new Date(2003, 5, 6), '6'],
      [7, 1, new Date(2003, 6, 7), '7'],
      [8, 1, new Date(2003, 7, 8), '8'],
      [9, 1, new Date(2003, 8, 9), '9'],
      [10, 1, new Date(2003, 9, 10), '10'],
    ]
    await db.query('insert into image(id, uid, cdate, comment) values ?', [list])
  })
  it('p 1, ps 128', async () => {
    const res = await sat.get('/image-list').expect(200).expect(/<title>RaySoda<\/title>/)
  })
  it('d 20030607', async () => {
    const res = await sat.get('/image-list?d=2003-06-07').expect(200)
  })

})