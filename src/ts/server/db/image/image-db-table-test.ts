import { ImageDB } from '@server/db/image/image-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('ImageDB.*Table', () => {

  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    idb = await getObject('ImageDB') as ImageDB
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
