import { closeAllObjects, getConfig, initObjectContext } from '../../oman/oman.js'
import { DB, getDatabase } from './db.js'

describe('DB', () => {

  let db: DB
  let dbName: string

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    dbName = getConfig().mysqlDatabase
    db = await getDatabase()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('database should exists 1', async () => {
    expect(await db.databaseExists(dbName)).toBeTrue()
  })
  it('drop database 1', async () => {
    await db.dropDatabase()
  })
  it('database should not exists 1', async () => {
    expect(await db.databaseExists(dbName)).toBeFalse()
  })
  it('create database 2', async () => {
    await db.createDatabase()
  })
  it('database exists 2', async () => {
    expect(await db.databaseExists(dbName)).toBeTrue()
  })
  it('drop database 2', async () => {
    await db.dropDatabase()
  })
  it('database should not exists 2', async () => {
    expect(await db.databaseExists(dbName)).toBeFalse()
  })

})
