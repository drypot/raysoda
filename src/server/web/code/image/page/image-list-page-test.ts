import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { RaySodaFileManager } from '../../../../file/raysoda-fileman'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { ValueDB } from '../../../../db/value/value-db'
import { BannerDB } from '../../../../db/banner/banner-db'
import { registerImageListPage } from './image-list-page'

describe('ImageListPage', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let vdb: ValueDB
  let bdb: BannerDB

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    vdb = ValueDB.from(db)
    bdb = await BannerDB.from(vdb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerImageListPage(web, uc, idb, ifm, bdb)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable(false)
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
