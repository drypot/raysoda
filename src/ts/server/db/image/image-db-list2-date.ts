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

  it('findImageFromDate 1', async () => {
    const r = await idb.findImageFromDate(new Date(2003, 6, 7))
    expect(r?.id).toBe(7)
  })
  it('findImageFromDate 2', async () => {
    const r = await idb.findImageFromDate(new Date(2000, 6, 7))
    expect(r?.id).toBe(1)
  })
  it('findImageFromDate 3', async () => {
    const r = await idb.findImageFromDate(new Date(2023, 6, 7))
    expect(r).toBeUndefined()
  })

})
