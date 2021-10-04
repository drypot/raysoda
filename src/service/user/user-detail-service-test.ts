import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ADMIN, GUEST, insertUserFix1, USER1 } from '../../db/user/fixture/user-fix.js'
import { userDetailService } from './user-detail-service.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { dateNull } from '../../_util/date2.js'
import { ErrorConst } from '../../_type/error.js'

describe('userDetailService', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('fill fix', async () => {
    await insertUserFix1(udb)
  })
  it('get user1 by guest', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, GUEST, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: dateNull,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get user1 by user1', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, USER1, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: USER1.adate,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get user1 by admin', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, ADMIN, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: USER1.adate,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get invalid', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, USER1, 99, err)
    expect(user).toBeUndefined()
  })

})
