import { loadConfigSync } from '../../_util/config-loader'
import { DB } from './db'
import { Config } from '../../_type/config'

describe('DB.createIndexIfNotExists', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await db.query('drop table if exists user1')
    await db.query('create table user1(id int, email varchar(64), primary key (id))')
  })
  it('find index returns nothing', async () => {
    expect(await db.findIndex('user1', 'email')).toBeUndefined()
  })
  it('create index', async () => {
    await db.createIndexIfNotExists('create index email on user1(email)')
  })
  it('find index returns table', async () => {
    expect(await db.findIndex('user1', 'email')).toBeDefined()
  })
  it('create again does not throw', async () => {
    await db.createIndexIfNotExists('create index email on user1(email)')
  })

})