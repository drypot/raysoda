import { ImageDB } from './image-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'

describe('ImageDB.*NextId', () => {

  let idb: ImageDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    idb = await getObject('ImageDB') as ImageDB
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
