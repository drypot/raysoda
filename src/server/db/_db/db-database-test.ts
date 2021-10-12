import { DB } from './db'
import { objManCloseAllObjects, objManGetObject, objManNewSession } from '../../objman/object-man'

describe('DB.*Database', () => {

  let db: DB

  beforeAll(async () => {
    objManNewSession('config/app-test.json')
    db = await objManGetObject('DB') as DB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('drop database', async () => {
    await db.dropDatabase()
  })
  it('database not exists', async () => {
    expect(await db.findDatabase(db.config.mysqlDatabase)).toBeUndefined()
  })
  it('create database', async () => {
    await db.createDatabase()
  })
  it('database exists', async () => {
    expect(await db.findDatabase(db.config.mysqlDatabase)).toBeDefined()
  })
  it('drop database again', async () => {
    await db.dropDatabase()
  })
  it('database not exists', async () => {
    expect(await db.findDatabase(db.config.mysqlDatabase)).toBeUndefined()
  })

})
