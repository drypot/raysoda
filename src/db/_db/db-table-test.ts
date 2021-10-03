import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from './db.js'
import { Config } from '../../_type/config.js'

describe('DB.*Table', () => {

  let config: Config
  let db: DB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  it('create table', async () => {
    await db.query('drop table if exists table1')
    await db.query('create table table1(id int)')
  })
  it('find table returns table', async () => {
    expect(await db.findTable('table1')).toBeDefined()
  })
  it('drop table', async () => {
    await db.query('drop table if exists table1')
  })
  it('find table returns nothing', async () => {
    expect(await db.findTable('table1')).toBeUndefined()
  })

})
