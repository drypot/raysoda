import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix1 } from '../../db/user/fixture/user-fix.js'
import { userDetailService } from './user-detail-service.js'
import { Config } from '../../_type/config.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { dateNull } from '../../_util/date2.js'
import { User } from '../../_type/user.js'

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
    const u1 = await uc.getCachedById(1) as User
    u1.adate = new Date('2021-10-01')
  })
  it('return user if id valid', async () => {
    const user = await userDetailService(uc, 1, false)
    if (!user) throw new Error()
    expect(user.id).toBe(1)
    expect(user.home).toBe('user1')
    expect(user.email).toBe('')
    expect(user.adate).toBe(dateNull)
  })
  it('return email if privInfo true', async () => {
    const user = await userDetailService(uc, 1, true)
    if (!user) throw new Error()
    expect(user.id).toBe(1)
    expect(user.home).toBe('user1')
    expect(user.email).toBe('user1@mail.test')
    expect(user.adate).toEqual(new Date('2021-10-01'))
  })
  it('return undefined if id invalid', async () => {
    const user = await userDetailService(uc, 99, false)
    expect(user).toBe(undefined)
  })
})
