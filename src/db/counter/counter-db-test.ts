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
      const r = await db.findTable('counter')
      expect(r.length).toBe(1)
    })
    it('drop table', async () => {
      await cdb.dropTable()
    })
    it('table does not exist', async () => {
      const r = await db.findTable('counter')
      expect(r.length).toBe(0)
    })
  })

  describe('insert', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('insert', async () => {
      await cdb.insert('cnt1', new Date(2021, 7, 15), 10)
    })
    it('check db', async () => {
      const r = await db.query('select * from counter where id=? and d=?', ['cnt1', '2021-08-15'])
      expect(dupeOf(r)).toEqual([
        { id: 'cnt1', d: '2021-08-15', c: 10 }
      ])
    })
    it('find', async () => {
      const c = await cdb.find('cnt1', '2021-08-15')
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
      await cdb.update('cnt1')
    })
    it('find', async () => {
      const c = await cdb.find('cnt1', ds)
      expect(c).toBe(1)
    })
    it('update', async () => {
      await cdb.update('cnt1')
    })
    it('update', async () => {
      await cdb.update('cnt1')
    })
    it('find', async () => {
      const c = await cdb.find('cnt1', ds)
      expect(c).toBe(3)
    })
  })

  describe('findRange', () => {
    it('init table', async () => {
      await cdb.dropTable()
      await cdb.createTable()
    })
    it('insert fix', async () => {
      await cdb.insert('cnt1', new Date(2003, 0, 17), 10)
      await cdb.insert('cnt1', new Date(2003, 0, 18), 20)
      await cdb.insert('cnt1', new Date(2003, 0, 19), 30)
      await cdb.insert('cnt1', new Date(2003, 0, 20), 40)
      await cdb.insert('cnt2', new Date(2003, 0, 17), 10)
      await cdb.insert('cnt2', new Date(2003, 0, 18), 20)
    })
    it('find range', async () => {
      const r = await cdb.findRange('cnt1', '2003-01-18', '2003-01-20')
      expect(dupeOf(r)).toEqual([
        { d: '2003-01-18', c: 20 },
        { d: '2003-01-19', c: 30 },
        { d: '2003-01-20', c: 40 },
      ])
    })
    it('find range 2', async () => {
      const r = await cdb.findRange('cnt2', '2003-01-10', '2003-01-17')
      expect(dupeOf(r)).toEqual([
        { d: '2003-01-17', c: 10 },
      ])
    })
    it('find range 3', async () => {
      const r = await cdb.findRange('cnt2', '2009-00-00', '2010-00-00')
      expect(dupeOf(r)).toEqual([])
    })
  })

})
