import { ImageDB } from '@server/db/image/image-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'
import { newPageParam } from '@common/type/page'
import { Image } from '@common/type/image'

describe('ImageDB getImagePage', () => {

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
    const img = await idb.findFirstImage()
    expect(img).toBeUndefined()
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
    const img = await idb.findFirstImage()
    expect(img?.id).toBe(1)
  })

  it('default', async () => {
    const p = newPageParam()
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(10)
    expect(list[0].id).toBe(10)
    expect(list[1].id).toBe(9)
    expect(list[2].id).toBe(8)
    expect(list[9].id).toBe(1)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(null)
  })
  it('size 3', async () => {
    const p = newPageParam()
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(10)
    expect(list[1].id).toBe(9)
    expect(list[2].id).toBe(8)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(7)
  })
  it('page 2, size 3', async () => {
    const p = newPageParam()
    p.page = 2
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(7)
    expect(list[1].id).toBe(6)
    expect(list[2].id).toBe(5)
    expect(page.prev).toBe(8)
    expect(page.next).toBe(4)
  })
  it('page 4, size 3', async () => {
    const p = newPageParam()
    p.page = 4
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(1)
    expect(page.prev).toBe(2)
    expect(page.next).toBe(null)
  })

  it('begin 8, size 3', async () => {
    const p = newPageParam()
    p.begin = 8
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(8)
    expect(list[1].id).toBe(7)
    expect(list[2].id).toBe(6)
    expect(page.prev).toBe(9)
    expect(page.next).toBe(5)
  })
  it('begin 12, size 3', async () => {
    const p = newPageParam()
    p.begin = 12
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(10)
    expect(list[1].id).toBe(9)
    expect(list[2].id).toBe(8)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(7)
  })
  it('begin 1, size 3', async () => {
    const p = newPageParam()
    p.begin = 1
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(1)
    expect(page.prev).toBe(2)
    expect(page.next).toBe(null)
  })

  it('end 9, size 3', async () => {
    const p = newPageParam()
    p.end = 9
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(2)
    expect(list[0].id).toBe(10)
    expect(list[1].id).toBe(9)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(8)
  })
  it('end 5, size 3', async () => {
    const p = newPageParam()
    p.end = 5
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(7)
    expect(list[1].id).toBe(6)
    expect(list[2].id).toBe(5)
    expect(page.prev).toBe(8)
    expect(page.next).toBe(4)
  })

  it('uid 2, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(5)
    expect(list[1].id).toBe(4)
    expect(list[2].id).toBe(3)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(2)
  })

  it('uid 2, begin 7, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.begin = 7
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(5)
    expect(list[1].id).toBe(4)
    expect(list[2].id).toBe(3)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(2)
  })
  it('uid 2, begin 4, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.begin = 4
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(4)
    expect(list[1].id).toBe(3)
    expect(list[2].id).toBe(2)
    expect(page.prev).toBe(5)
    expect(page.next).toBe(1)
  })
  it('uid 2, begin 2, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.begin = 2
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(2)
    expect(list[0].id).toBe(2)
    expect(list[1].id).toBe(1)
    expect(page.prev).toBe(3)
    expect(page.next).toBe(null)
  })

  it('uid 2, end 2, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.end = 2
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(4)
    expect(list[1].id).toBe(3)
    expect(list[2].id).toBe(2)
    expect(page.prev).toBe(5)
    expect(page.next).toBe(1)
  })
  it('uid 2, end 4, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.end = 4
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(2)
    expect(list[0].id).toBe(5)
    expect(list[1].id).toBe(4)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(3)
  })

  it('date 2003 6 7, size 3', async () => {
    const p = newPageParam()
    p.date = new Date(2003, 6, 7)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(9)
    expect(list[1].id).toBe(8)
    expect(list[2].id).toBe(7)
    expect(page.prev).toBe(10)
    expect(page.next).toBe(6)
  })
  it('date 1970 1 1, size 3', async () => {
    const p = newPageParam()
    p.date = new Date(1970, 1, 1)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(3)
    expect(list[1].id).toBe(2)
    expect(list[2].id).toBe(1)
    expect(page.prev).toBe(4)
    expect(page.next).toBe(null)
  })
  it('date 2100 1 1, size 3', async () => {
    const p = newPageParam()
    p.date = new Date(2100, 1, 1)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(0)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(null)
  })

  it('uid 2, date 2003 1 2, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.date = new Date(2003, 1, 2)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(4)
    expect(list[1].id).toBe(3)
    expect(list[2].id).toBe(2)
    expect(page.prev).toBe(5)
    expect(page.next).toBe(1)
  })
  it('uid 2, date 1970 1 1, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.date = new Date(1970, 1, 1)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(3)
    expect(list[0].id).toBe(3)
    expect(list[1].id).toBe(2)
    expect(list[2].id).toBe(1)
    expect(page.prev).toBe(4)
    expect(page.next).toBe(null)
  })
  it('uid 2, date 2100 1 1, size 3', async () => {
    const p = newPageParam()
    p.uid = 2
    p.date = new Date(2100, 1, 1)
    p.size = 3
    const page = await idb.getImagePage(p)
    const list = page.list as Image[]
    expect(list.length).toBe(0)
    expect(page.prev).toBe(null)
    expect(page.next).toBe(null)
  })

})
