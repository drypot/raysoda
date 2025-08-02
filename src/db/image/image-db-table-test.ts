import { getImageDB, ImageDB } from './image-db.js'
import { closeAllObjects, initObjectContext } from '../../oman/oman.js'
import { DB, getDatabase } from '../db/db.js'

describe('ImageDB.*Table', () => {

  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    idb = await getImageDB()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('drop table', async () => {
    await idb.dropTable()
  })
  it('create table', async () => {
    await idb.createTable()
  })
  it('table exists', async () => {
    expect(await db.getTable('image')).toBeDefined()
  })
  it('index exists', async () => {
    expect(await db.getIndex('image', 'image_cdate')).toBeDefined()
  })
  it('index exists 2', async () => {
    expect(await db.getIndex('image', 'image_uid_cdate')).toBeDefined()
  })
  it('drop table', async () => {
    await idb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.getTable('image')).toBeUndefined()
  })

})
