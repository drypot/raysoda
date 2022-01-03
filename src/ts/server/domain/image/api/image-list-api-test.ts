import supertest, { SuperAgentTest } from 'supertest'
import { ImageFileManager } from '@server/fileman/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useImageListApi } from '@server/domain/image/api/image-list-api'
import { Express2 } from '@server/express/express2'
import { omanGetImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { DB } from '@server/db/_db/db'

describe('ImageListApi', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
    web = await omanGetObject('Express2') as Express2
    await useImageListApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await userFixInsert4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('remove image dir', async () => {
    await ifm.rmRoot()
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

  it('default', async () => {
    const res = await sat.get('/api/image-list').expect(200)
    expect(res.body.list.length).toBe(10)
    expect(res.body.prev).toBe(null)
    expect(res.body.next).toBe(null)
  })

  it('ps 1', async () => {
    const res = await sat.get('/api/image-list?ps=1').expect(200)
    expect(res.body.list).toEqual([{
      id: 10,
      owner: { id: 1, name: 'name1', home: 'home1' },
      cdateStr: '2003-10-10 00:00:00',
      comment: '10',
      vers: null,
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/10.jpg'
    }])
    expect(res.body.prev).toBe(null)
    expect(res.body.next).toBe(9)
  })

  it('pb 8, ps 3', async () => {
    const res = await sat.get('/api/image-list?pb=8&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(8)
    expect(res.body.list[1].id).toBe(7)
    expect(res.body.list[2].id).toBe(6)
    expect(res.body.prev).toBe(9)
    expect(res.body.next).toBe(5)
  })

  it('pe 5, ps 3', async () => {
    const res = await sat.get('/api/image-list?pe=5&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(7)
    expect(res.body.list[1].id).toBe(6)
    expect(res.body.list[2].id).toBe(5)
    expect(res.body.prev).toBe(8)
    expect(res.body.next).toBe(4)
  })

  it('uid 2, ps 3', async () => {
    const res = await sat.get('/api/image-list?uid=2&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(5)
    expect(res.body.list[1].id).toBe(4)
    expect(res.body.list[2].id).toBe(3)
    expect(res.body.prev).toBe(null)
    expect(res.body.next).toBe(2)
  })

  it('d 2003 6 7, ps 3', async () => {
    const res = await sat.get('/api/image-list?d=2003-6-7&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(9)
    expect(res.body.list[1].id).toBe(8)
    expect(res.body.list[2].id).toBe(7)
    expect(res.body.prev).toBe(10)
    expect(res.body.next).toBe(6)
  })

})
