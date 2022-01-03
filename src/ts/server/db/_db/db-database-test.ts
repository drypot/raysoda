import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('DB.*Database', () => {

  let db: DB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('drop database', async () => {
    await db.dropDatabase()
  })
  it('database not exists', async () => {
    expect(await db.getDatabase(db.dbName)).toBeUndefined()
  })
  it('create database', async () => {
    await db.createDatabase()
  })
  it('database exists', async () => {
    expect(await db.getDatabase(db.dbName)).toBeDefined()
  })
  it('drop database again', async () => {
    await db.dropDatabase()
  })
  it('database not exists', async () => {
    expect(await db.getDatabase(db.dbName)).toBeUndefined()
  })

})
