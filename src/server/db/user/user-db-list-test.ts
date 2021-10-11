import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../_db/db'
import { UserDB } from './user-db'
import { insertUserFix4 } from './fixture/user-fix'
import { Config } from '../../_type/config'

describe('UserDB.findUserList', () => {

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
  it('get list default opt', async () => {
    const l = await udb.findUserList()
    expect(l.length).toBe(4)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
    expect(l[3].home).toBe('admin')
  })
  it('get offset 0, ps 3', async () => {
    const l = await udb.findUserList(0, 3)
    expect(l.length).toBe(3)
    // ordered by pdate desc
    expect(l[0].home).toBe('user2')
    expect(l[1].home).toBe('user3')
    expect(l[2].home).toBe('user1')
  })
  it('get offset 3, ps 3', async () => {
    const l = await udb.findUserList(3, 3)
    expect(l.length).toBe(1)
    // ordered by pdate desc
    expect(l[0].home).toBe('admin')
  })
  it('get offset 6, ps 3', async () => {
    const l = await udb.findUserList(6, 3)
    expect(l.length).toBe(0)
  })

})