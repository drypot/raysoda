import { loadConfigSync } from '../../_util/config-loader.js'
import { CounterDB } from './counter-db.js'
import { DB } from '../_db/db.js'
import { dupe } from '../../_util/object2.js'
import { Config } from '../../_type/config.js'

describe('CounterDB List', () => {

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

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('insert fix', async () => {
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 18), 20)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 19), 30)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 20), 40)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 18), 20)
  })
  it('list 1', async () => {
    const r = await cdb.findCounterList('cnt1', '2003-01-18', '2003-01-20')
    expect(dupe(r)).toEqual([
      { id: 'cnt1', d: '2003-01-18', c: 20 },
      { id: 'cnt1', d: '2003-01-19', c: 30 },
      { id: 'cnt1', d: '2003-01-20', c: 40 },
    ])
  })
  it('list 2', async () => {
    const r = await cdb.findCounterList('cnt2', '2003-01-10', '2003-01-17')
    expect(dupe(r)).toEqual([
      { id: 'cnt2', d: '2003-01-17', c: 10 },
    ])
  })
  it('list 3', async () => {
    const r = await cdb.findCounterList('cnt2', '2009-00-00', '2010-00-00')
    expect(dupe(r)).toEqual([])
  })
  it('list undefined', async () => {
    const r = await cdb.findCounterList('cntx', '2009-00-00', '2010-00-00')
    expect(dupe(r)).toEqual([])
  })

})
