import { ImageDB } from '@server/db/image/image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'

describe('ImageDB.findImageList Set 2', () => {

  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    idb = await omanGetObject('ImageDB') as ImageDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  const d = new Date()

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('find first image returns nothing', async () => {
    const r = await idb.findFirstImage()
    expect(r).toBeUndefined()
  })
  it('insert fix', async () => {
    const list = [
      [1, 2, new Date(2003, 0, 1), '1'],
      [2, 2, new Date(2003, 1, 2), '2'],
      [3, 2, new Date(2003, 2, 3), '3'],
      [4, 2, new Date(2003, 3, 4), '4'],
      [5, 2, new Date(2003, 4, 5), '5'],
      [6, 1, new Date(2003, 5, 6), '6'],
      [7, 1, new Date(2003, 6, 7), '7'],
      [8, 1, new Date(2003, 7, 8), '8'],
      [9, 1, new Date(2003, 8, 9), '9'],
      [10, 1, new Date(2003, 9, 10), '10'],
    ]
    await db.query('insert into image(id, uid, cdate, comment) values ?', [list])
  })
  it('find first image returns image', async () => {
    const r = await idb.findFirstImage()
    expect(r?.id).toBe(1)
  })

  // test findImageListStartingAt
  it('findImageListStartingAt 8, 4', async () => {
    const r = await idb.findImageListStartingAt(8, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(8)
    expect(r[1].id).toBe(7)
    expect(r[2].id).toBe(6)
    expect(r[3].id).toBe(5)
  })
  it('findImageListStartingAt 2, 4', async () => {
    const r = await idb.findImageListStartingAt(2, 4)
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(2)
    expect(r[1].id).toBe(1)
  })
  it('findImageListStartingAt 0, 4', async () => {
    const r = await idb.findImageListStartingAt(0, 4)
    expect(r.length).toBe(0)
  })

  // test findImageListEndingAt
  it('findImageListEndingAt 8, 4', async () => {
    const r = await idb.findImageListEndingAt(8, 4)
    expect(r.length).toBe(3)
    expect(r[0].id).toBe(10)
    expect(r[1].id).toBe(9)
    expect(r[2].id).toBe(8)
  })
  it('findImageListEndingAt 2, 4', async () => {
    const r = await idb.findImageListEndingAt(2, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(5)
    expect(r[1].id).toBe(4)
    expect(r[2].id).toBe(3)
    expect(r[3].id).toBe(2)
  })
  it('findImageListEndingAt 12, 4', async () => {
    const r = await idb.findImageListEndingAt(12, 4)
    expect(r.length).toBe(0)
  })

  // test findPrevImage
  it('findPrevImage 5', async () => {
    const r = await idb.findPrevImageFrom(5)
    expect(r?.id).toBe(6)
  })
  it('findPrevImage 12', async () => {
    const r = await idb.findPrevImageFrom(12)
    expect(r).toBeUndefined()
  })
  it('findPrevImage 0', async () => {
    const r = await idb.findPrevImageFrom(0)
    expect(r?.id).toBe(1)
  })

  // test findNextImage
  it('findNextImage 5', async () => {
    const r = await idb.findNextImageFrom(5)
    expect(r?.id).toBe(4)
  })
  it('findNextImage 12', async () => {
    const r = await idb.findNextImageFrom(12)
    expect(r?.id).toBe(10)
  })
  it('findNextImage 1', async () => {
    const r = await idb.findNextImageFrom(1)
    expect(r).toBeUndefined()
  })

})
