import { loadConfigSync } from '../../_util/config-loader.js'
import { CounterDB } from './counter-db.js'
import { DB } from '../_db/db.js'
import { newDateStringNoTime } from '../../_util/date2.js'
import { dupe } from '../../_util/object2.js'
import { Config } from '../../_type/config.js'

describe('CounterDB', () => {
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

  describe('table', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('table exists', async () => {
      expect(await db.findTable('counter')).toBeDefined()
    })
    it('drop table', async () => {
      await cdb.dropTable()
    })
    it('table does not exist', async () => {
      expect(await db.findTable('counter')).toBeUndefined()
    })
  })

  describe('increase', () => {
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
      expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 1})
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
      expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 3})
    })
  })

  describe('replace', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('replace', async () => {
      await cdb.replaceCounter('cnt1', new Date(2021, 7, 15), 10)
    })
    it('check db', async () => {
      const r = await db.queryOne('select * from counter where id=? and d=?', ['cnt1', '2021-08-15'])
      expect(dupe(r)).toEqual({
        id: 'cnt1', d: '2021-08-15', c: 10
      })
    })
    it('find', async () => {
      const c = await cdb.findCounter('cnt1', '2021-08-15')
      expect(dupe(c)).toEqual({ id: 'cnt1', d: '2021-08-15', c: 10})
    })
  })

  describe('list', () => {
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
})
