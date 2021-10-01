import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from './db.js'
import { Config } from '../../_type/config.js'

describe('db.*Database', () => {
  let config: Config
  let db: DB

  beforeAll(() => {
    config = loadConfigSync('config/app-test.json')
    db = DB.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

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
