import { ImageDB } from './image-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('ImageDB.*Table', () => {

  let idb: ImageDB

  beforeAll(async () => {
    objManNewSessionForTest()
    idb = await objManGetObject('ImageDB') as ImageDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('drop table', async () => {
    await idb.dropTable()
  })
  it('create table', async () => {
    await idb.createTable()
  })
  it('table exists', async () => {
    expect(await idb.db.findTable('image')).toBeDefined()
  })
  it('index exists', async () => {
    expect(await idb.db.findIndex('image', 'image_cdate')).toBeDefined()
  })
  it('index exists 2', async () => {
    expect(await idb.db.findIndex('image', 'image_uid_cdate')).toBeDefined()
  })
  it('drop table', async () => {
    await idb.dropTable()
  })
  it('table not exists', async () => {
    expect(await idb.db.findTable('image')).toBeUndefined()
  })

})
