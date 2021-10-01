import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../_db/db.js'
import { UserDB } from './user-db.js'
import { insertUserFix4 } from './fixture/user-fix.js'
import { Config } from '../../_type/config.js'

describe('UserDB.searchUser', () => {
  let config: Config
  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
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
  it('search user1', async () => {
    const l = await udb.searchUser('user1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search USER1', async () => {
    const l = await udb.searchUser('USER1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search User 1', async () => {
    const l = await udb.searchUser('User 1')
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search user1@mail.test as user', async () => {
    const l = await udb.searchUser('user1@mail.test')
    expect(l.length).toBe(0)
  })
  it('search user1@mail.test as admin', async () => {
    const l = await udb.searchUser('user1@mail.test', 0, 100, true)
    expect(l.length).toBe(1)
    expect(l[0].home).toBe('user1')
  })
  it('search userx', async () => {
    const l = await udb.searchUser('userx')
    expect(l.length).toBe(0)
  })
})
