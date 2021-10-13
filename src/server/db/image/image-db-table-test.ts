import { ImageDB } from './image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'
import { DB } from '../_db/db'

describe('ImageDB.*Table', () => {

  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    omanNewSessionForTest()
    db = await omanGetObject('DB') as DB
    idb = await omanGetObject('ImageDB') as ImageDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('drop table', async () => {
    await idb.dropTable()
  })
  it('create table', async () => {
    await idb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('image')).toBeDefined()
  })
  it('index exists', async () => {
    expect(await db.findIndex('image', 'image_cdate')).toBeDefined()
  })
  it('index exists 2', async () => {
    expect(await db.findIndex('image', 'image_uid_cdate')).toBeDefined()
  })
  it('drop table', async () => {
    await idb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('image')).toBeUndefined()
  })

})
