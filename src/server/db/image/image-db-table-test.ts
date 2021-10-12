import { ImageDB } from './image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ImageDB.*Table', () => {

  let idb: ImageDB

  beforeAll(async () => {
    omanNewSessionForTest()
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
