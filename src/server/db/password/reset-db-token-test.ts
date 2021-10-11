import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../_db/db'
import { ResetDB } from './reset-db'
import { Config } from '../../_type/config'
import { ResetToken } from '../../_type/password'

describe('ResetDB Token', () => {

  let config: Config
  let db: DB
  let rdb: ResetDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    rdb = ResetDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await rdb.dropTable()
    await rdb.createTable(false)
  })
  it('find returns nothing', async () => {
    const r = await rdb.findByUuid('uuid1')
    expect(r?.email).toBe(undefined)
  })
  it('insert', async () => {
    const r: ResetToken = {
      uuid: 'uuid1',
      email: 'user1@mail.test',
      token: 'token1'
    }
    await rdb.insert(r)
  })
  it('find by uuid', async () => {
    const r = await rdb.findByUuid('uuid1')
    expect(r?.email).toBe('user1@mail.test')
  })
  it('find by email', async () => {
    const r = await rdb.findByEmail('user1@mail.test')
    expect(r?.email).toBe('user1@mail.test')
  })
  it('delete', async () => {
    await rdb.deleteByEmail('user1@mail.test')
  })
  it('find returns nothing', async () => {
    const r3 = await rdb.findByUuid('uuid1')
    expect(r3?.email).toBe(undefined)
  })

})
