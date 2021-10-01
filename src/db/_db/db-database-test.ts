import { readConfigSync } from '../../_util/config-loader.js'
import { DB } from './db.js'
import { Config } from '../../_type/config.js'

describe('DB', () => {

  let config: Config
  let db: DB

  beforeAll(() => {
    config = readConfigSync('config/app-test.json')
    db = DB.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('database', () => {
    it('drop database', async () => {
      await db.dropDatabase()
    })
    it('database not exists', async () => {
      expect(await db.findDatabase(config.mysqlDatabase)).toBeUndefined()
    })
    it('create database', async () => {
      await db.createDatabase()
    })
    it('database exists', async () => {
      expect(await db.findDatabase(config.mysqlDatabase)).toBeDefined()
    })
    it('drop database again', async () => {
      await db.dropDatabase()
    })
    it('database not exists', async () => {
      expect(await db.findDatabase(config.mysqlDatabase)).toBeUndefined()
    })
  })
})
