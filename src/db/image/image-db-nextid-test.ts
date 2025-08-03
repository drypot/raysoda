import { getImageDB, ImageDB } from './image-db.ts'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'

describe('ImageDB.*NextId', () => {

  let idb: ImageDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    idb = await getImageDB()
  })

  afterAll(async () => {
    await closeAllObjects()
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
