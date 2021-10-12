import { ImageDB } from './image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ImageDB.*NextId', () => {

  let idb: ImageDB

  beforeAll(async () => {
    omanNewSessionForTest()
    idb = await omanGetObject('ImageDB') as ImageDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('get next image id', () => {
    expect(idb.getNextId()).toBe(1)
    expect(idb.getNextId()).toBe(2)
    expect(idb.getNextId()).toBe(3)
  })
  it('set next image id', () => {
    idb.setNextId(10)
  })
  it('get next image id', () => {
    expect(idb.getNextId()).toBe(10)
    expect(idb.getNextId()).toBe(11)
  })

})
