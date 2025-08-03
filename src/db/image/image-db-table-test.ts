import { getImageDB, ImageDB } from './image-db.ts'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { DB, getDatabase } from '../db/db.ts'

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
    expect(await db.tableExists('image')).toBeTrue()
  })
  it('index exists', async () => {
    expect(await db.indexExists('image', 'image_cdate')).toBeTrue()
  })
  it('index exists 2', async () => {
    expect(await db.indexExists('image', 'image_uid_cdate')).toBeTrue()
  })
  it('drop table', async () => {
    await idb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.tableExists('image')).toBeFalse()
  })

})
