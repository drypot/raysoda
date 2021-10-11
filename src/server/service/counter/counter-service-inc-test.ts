import { Config } from '../../_type/config.js'
import { DB } from '../../db/_db/db.js'
import { newDateStringNoTime } from '../../_util/date2.js'
import { loadConfigSync } from '../../_util/config-loader.js'
import { CounterDB } from '../../db/counter/counter-db.js'
import { counterIncService } from './counter-service.js'
import { dupe } from '../../_util/object2.js'

describe('Counter Api Inc', () => {

  let config: Config
  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    db = await DB.from(config).createDatabase()
    cdb = CounterDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  const d = newDateStringNoTime(new Date())

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('update', async () => {
    await counterIncService(cdb, 'abc')
  })
  it('check db', async () => {
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('update 2', async () => {
    await counterIncService(cdb, 'abc')
  })
  it('check db 2', async () => {
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })

})
