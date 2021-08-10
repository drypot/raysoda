import { Config, loadConfig } from '../../app/config/config.js'
import { DB } from './db.js'
import { ValueDB } from './value-db.js'

describe('ValueDB', () => {

  let config: Config
  let db: DB
  let vdb: ValueDB

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')
    db = new DB(config)
    vdb = new ValueDB(db)
    await db.createDatabase()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('createTable', () => {
    it('should work', async () => {
      await vdb.dropTable()
      await vdb.createTable()
      const r = await db.findTable('persist')
      expect(r.length).toBe(1)
    })
  })

  describe('dropTable', () => {
    it('should work', async () => {
      await vdb.createTable()
      await vdb.dropTable()
      const r = await db.findTable('persist')
      expect(r.length).toBe(0)
    })
  })

  describe('updateKeyValue/findKeyValue', () => {
    beforeAll(async () => {
      await vdb.dropTable()
      await vdb.createTable()
    })
    it('should work with string', async () => {
      let v: any

      await vdb.updateValue('s1', 'value1')
      v = await vdb.findValue('s1')
      expect(v).toBe('value1')

      await vdb.updateValue('s1', 'value2')
      v = await vdb.findValue('s1')
      expect(v).toBe('value2')
    })
    it('should work with empty string', async () => {
      await vdb.updateValue('empty', '')
      const v = await vdb.findValue('empty')
      expect(v).toBe('')
    })
    it('should work with number', async () => {
      await vdb.updateValue('n1', 123)
      const v = await vdb.findValue('n1')
      expect(v).toBe(123)
    })
    it('should work with 0', async () => {
      await vdb.updateValue('zero', 0)
      const v = await vdb.findValue('zero')
      expect(v).toBe(0)
    })
    it('should work with object', async () => {
      await vdb.updateValue('o', { p1: 123, p2: 456 })
      const v = await vdb.findValue('o')
      expect(v).toEqual({ p1: 123, p2: 456 })
    })
    it('should work with empty object', async () => {
      await vdb.updateValue('emptyObj', {})
      const v = await vdb.findValue('emptyObj')
      expect(v).toEqual({})
    })
    it('should work with null', async () => {
      await vdb.updateValue('null', null)
      const v = await vdb.findValue('null')
      expect(v).toBe(null)
    })
    it('should work with undefined', async () => {
      const v = await vdb.findValue('noname')
      expect(v).toBe(undefined)
    })
  })

})
