import { Config, configFrom } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { PwResetDB, PwResetRecord } from './pwreset-db.js'

describe('ResetDB', () => {

  let config: Config
  let db: DB
  let rdb: PwResetDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    rdb = PwResetDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('table', () => {
    it('drop table', async () => {
      await rdb.dropTable()
    })
    it('table not exists', async () => {
      expect(await db.tableExists('pwreset')).toBe(false)
    })
    it('create table', async () => {
      await rdb.createTable(true) // 인덱스까지 만들어 본다
    })
    it('table exists', async () => {
      expect(await db.tableExists('pwreset')).toBe(true)
    })
    it('drop table', async () => {
      await rdb.dropTable()
    })
    it('table not exists', async () => {
      expect(await db.tableExists('pwreset')).toBe(false)
    })
  })

  describe('insert/delete/select', () => {
    it('init table', async () => {
      await rdb.dropTable()
      await rdb.createTable(false)
    })
    it('select', async () => {
      const r = await rdb.selectByUuid('uuid1')
      expect(r?.email).toBe(undefined)
    })
    it('insert', async () => {
      const r: PwResetRecord = {
        uuid: 'uuid1',
        email: 'user1@mail.test',
        token: 'token1'
      }
      await rdb.insert(r)
    })
    it('select by uuid', async () => {
      const r = await rdb.selectByUuid('uuid1')
      expect(r?.email).toBe('user1@mail.test')
    })
    it('select by email', async () => {
      const r = await rdb.selectByEmail('user1@mail.test')
      expect(r?.email).toBe('user1@mail.test')
    })
    it('delete', async () => {
      await rdb.deleteByEmail('user1@mail.test')
    })
    it('select', async () => {
      const r3 = await rdb.selectByUuid('uuid1')
      expect(r3?.email).toBe(undefined)
    })
  })

})
