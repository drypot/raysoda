import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../../db/_db/db'
import { UserDB } from '../../db/user/user-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { userUpdateGetService } from './user-update-service'
import { NOT_AUTHORIZED } from '../../_type/error-user'
import { Config } from '../../_type/config'
import { UserCache } from '../../db/user/cache/user-cache'
import { ErrorConst } from '../../_type/error'

describe('userUpdateGetService', () => {

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
    await insertUserFix4(udb)
  })
  it('get user1 for update', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, USER1, 1, err)
    expect(user1).toEqual({
      name: 'User 1',
      home: 'user1',
      email: 'user1@mail.test',
      password: '',
      profile: '',
    })
    expect(err.length).toBe(0)
  })
  it('get user1 for update by user2', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, USER2, 1, err)
    expect(user1).toBeUndefined()
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('get user1 for update by admin', async () => {
    const err: ErrorConst[] = []
    const user1 = await userUpdateGetService(uc, ADMIN, 1, err)
    expect(user1).toEqual({
      name: 'User 1',
      home: 'user1',
      email: 'user1@mail.test',
      password: '',
      profile: '',
    })
    expect(err.length).toBe(0)
  })

})
