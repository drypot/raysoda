import { Config, configFrom } from '../../config/config.js'
import { CounterDB } from './counter-db.js'
import { DB } from '../_db/db.js'
import { dateStringFrom } from '../../lib/base/date2.js'
import { dupeOf } from '../../lib/base/object2.js'

describe('CounterDB', () => {

  let config: Config
  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    cdb = CounterDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('table', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('table exists', async () => {
      expect(await db.tableExists('counter')).toBe(true)
    })
    it('drop table', async () => {
      await cdb.dropTable()
    })
    it('table does not exist', async () => {
      expect(await db.tableExists('counter')).toBe(false)
    })
  })

  describe('insert', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('insert', async () => {
      await cdb.insertCounter('cnt1', new Date(2021, 7, 15), 10)
    })
    it('check db', async () => {
      const r = await db.query('select * from counter where id=? and d=?', ['cnt1', '2021-08-15'])
      expect(dupeOf(r)).toEqual([
        { id: 'cnt1', d: '2021-08-15', c: 10 }
      ])
    })
    it('select', async () => {
      const c = await cdb.selectCounter('cnt1', '2021-08-15')
      expect(c).toBe(10)
    })
  })

  describe('update', () => {
    const ds = dateStringFrom(new Date())
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('update', async () => {
      await cdb.updateCounter('cnt1')
    })
    it('select', async () => {
      const c = await cdb.selectCounter('cnt1', ds)
      expect(c).toBe(1)
    })
    it('update', async () => {
      await cdb.updateCounter('cnt1')
    })
    it('update', async () => {
      await cdb.updateCounter('cnt1')
    })
    it('select', async () => {
      const c = await cdb.selectCounter('cnt1', ds)
      expect(c).toBe(3)
    })
  })

  describe('findRange', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('insert fix', async () => {
      await cdb.insertCounter('cnt1', new Date(2003, 0, 17), 10)
      await cdb.insertCounter('cnt1', new Date(2003, 0, 18), 20)
      await cdb.insertCounter('cnt1', new Date(2003, 0, 19), 30)
      await cdb.insertCounter('cnt1', new Date(2003, 0, 20), 40)
      await cdb.insertCounter('cnt2', new Date(2003, 0, 17), 10)
      await cdb.insertCounter('cnt2', new Date(2003, 0, 18), 20)
    })
    it('select range', async () => {
      const r = await cdb.selectCounterList('cnt1', '2003-01-18', '2003-01-20')
      expect(dupeOf(r)).toEqual([
        { d: '2003-01-18', c: 20 },
        { d: '2003-01-19', c: 30 },
        { d: '2003-01-20', c: 40 },
      ])
    })
    it('select range 2', async () => {
      const r = await cdb.selectCounterList('cnt2', '2003-01-10', '2003-01-17')
      expect(dupeOf(r)).toEqual([
        { d: '2003-01-17', c: 10 },
      ])
    })
    it('select range 3', async () => {
      const r = await cdb.selectCounterList('cnt2', '2009-00-00', '2010-00-00')
      expect(dupeOf(r)).toEqual([])
    })
  })

})
