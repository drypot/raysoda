import { ImageDB } from './image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ImageDB.find*List', () => {

  let idb: ImageDB

  beforeAll(async () => {
    omanNewSessionForTest()
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
    await idb.db.query('insert into image(id, uid, cdate, comment) values ?', [list])
  })
  it('find first image returns image', async () => {
    const r = await idb.findFirstImage()
    expect(r?.id).toBe(1)
  })
  it('find list 0, 128', async () => {
    const r = await idb.findImageList(0, 128)
    expect(r.length).toBe(10)
    expect(r[0].id).toBe(10)
    expect(r[1].id).toBe(9)
    expect(r[2].id).toBe(8)
    expect(r[9].id).toBe(1)
  })
  it('find list 0, 4', async () => {
    const r = await idb.findImageList(0, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(10)
    expect(r[3].id).toBe(7)
  })
  it('find list 4, 4', async () => {
    const r = await idb.findImageList(4, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('find list 8, 4', async () => {
    const r = await idb.findImageList(8, 4)
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(2)
    expect(r[1].id).toBe(1)
  })
  it('find list by user', async () => {
    const r = await idb.findImageListByUser(2, 0, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(5)
    expect(r[3].id).toBe(2)
  })
  it('find list by cdate', async () => {
    const r = await idb.findImageListByCdate(new Date(2003, 6, 7), 0, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('find cdate list by user', async () => {
    const r = await idb.findCdateListByUser(2, 3)
    expect(r.length).toBe(3)
    expect(r[0].id).toBe(5)
    expect(r[2].id).toBe(3)
  })

})
