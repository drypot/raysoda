import { Config, configFrom } from '../../app/config/config.js'
import { DB } from './db.js'
import { ValueDB } from './value-db.js'

describe('ValueDB', () => {

  let config: Config
  let db: DB
  let vdb: ValueDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    vdb = ValueDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('table', () => {
    it('after init table', async () => {
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('table should exist', async () => {
      const r = await db.findTable('persist')
      expect(r.length).toBe(1)
    })
    it('after drop table', async () => {
      await vdb.dropTable()
    })
    it('table should not exist', async () => {
      const r = await db.findTable('persist')
      expect(r.length).toBe(0)
    })
  })

  describe('updateValue', () => {
    it('after init table', async () => {
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('inserts new key/value', async () => {
      await vdb.updateValue('s1', 'value1')
    })
    it('can be checked', async () => {
      const v = await vdb.findValue('s1')
      expect(v).toBe('value1')
    })
    it('updates key/value', async () => {
      await vdb.updateValue('s1', 'value2')
    })
    it('can be checked', async () => {
      const v = await vdb.findValue('s1')
      expect(v).toBe('value2')
    })
    it('works with empty string', async () => {
      await vdb.updateValue('empty', '')
      const v = await vdb.findValue('empty')
      expect(v).toBe('')
    })
    it('works with number', async () => {
      await vdb.updateValue('n1', 123)
      const v = await vdb.findValue('n1')
      expect(v).toBe(123)
    })
    it('works with 0', async () => {
      await vdb.updateValue('zero', 0)
      const v = await vdb.findValue('zero')
      expect(v).toBe(0)
    })
    it('works with object', async () => {
      await vdb.updateValue('o', { p1: 123, p2: 456 })
      const v = await vdb.findValue('o')
      expect(v).toEqual({ p1: 123, p2: 456 })
    })
    it('works with empty object', async () => {
      await vdb.updateValue('emptyObj', {})
      const v = await vdb.findValue('emptyObj')
      expect(v).toEqual({})
    })
    it('works with null', async () => {
      await vdb.updateValue('null', null)
      const v = await vdb.findValue('null')
      expect(v).toBe(null)
    })
    it('works with undefined', async () => {
      const v = await vdb.findValue('noname')
      expect(v).toBe(undefined)
    })
  })

})
