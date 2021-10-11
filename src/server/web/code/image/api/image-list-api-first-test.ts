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
import { registerImageListApi } from './image-list-api'
import { SITE_OPEN_DATE } from '../../../../_type/date-const'

describe('ImageListApi FirstImageCdate', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerImageListApi(web, uc, idb, ifm)
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
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })
  it('get cdate when empty', async () => {
    const res = await sat.get('/api/first-image-cdate').expect(200)
    expect(res.body.cdateNum).toBe(SITE_OPEN_DATE.getTime())
  })
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
  it('get cdate after filled', async () => {
    const res = await sat.get('/api/first-image-cdate').expect(200)
    expect(Date.now() - res.body.todayNum).toBeLessThan(1000)
    expect(res.body.cdateNum).toEqual(new Date(2003, 0, 1).getTime())
  })

})
