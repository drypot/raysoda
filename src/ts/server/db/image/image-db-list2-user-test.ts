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

  it('findUserImageListStartingAt 1, 7, 4', async () => {
    const r = await idb.findUserImageListStartingAt(1, 7, 4)
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(7)
    expect(r[1].id).toBe(6)
  })

  it('findUserImageListEndingAt 2, 4, 4', async () => {
    const r = await idb.findUserImageListEndingAt(2, 4, 4)
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(5)
    expect(r[1].id).toBe(4)
  })

  // test findPrevUserImageFrom
  it('findPrevUserImageFrom 1, 8', async () => {
    const r = await idb.findPrevUserImageFrom(1, 8)
    expect(r?.id).toBe(9)
  })
  it('findPrevUserImageFrom 1, 4', async () => {
    const r = await idb.findPrevUserImageFrom(1, 4)
    expect(r?.id).toBe(6)
  })

  // test findNextUserImageFrom
  it('findNextUserImageFrom 1, 8', async () => {
    const r = await idb.findNextUserImageFrom(1, 8)
    expect(r?.id).toBe(7)
  })
  it('findNextUserImageFrom 1, 4', async () => {
    const r = await idb.findNextUserImageFrom(1, 4)
    expect(r).toBeUndefined()
  })

})
