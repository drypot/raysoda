import { ImageDB } from '@server/db/image/image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('ImageDB.*NextId', () => {

  let idb: ImageDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
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
