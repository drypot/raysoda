import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'
import { DB } from './db.js'

import './db.js'

describe('DB.*Database', () => {

  let db: DB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
  })

  afterAll(async () => {
    await closeAllObjects()
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
