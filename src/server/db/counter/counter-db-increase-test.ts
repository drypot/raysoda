import { loadConfigSync } from '../../_util/config-loader.js'
import { CounterDB } from './counter-db.js'
import { DB } from '../_db/db.js'
import { newDateStringNoTime } from '../../_util/date2.js'
import { dupe } from '../../_util/object2.js'
import { Config } from '../../_type/config.js'

describe('CounterDB Increase', () => {

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

  const ds = newDateStringNoTime(new Date())

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('increase 1', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('find 1', async () => {
    const c = await cdb.findCounter('cnt1', ds)
    const d = newDateStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 1 })
  })
  it('increase 2', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('increase 3', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('find 2', async () => {
    const c = await cdb.findCounter('cnt1', ds)
    const d = newDateStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 3 })
  })

})
