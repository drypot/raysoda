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
  it('p 1, ps 1', async () => {
    const res = await sat.get('/api/image-list?p=1&ps=1').expect(200)
    const r = res.body.list
    expect(r).toEqual([{
      id: 10,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdateStr: '2003-10-10 00:00:00',
      comment: '10',
      vers: null,
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/10.jpg'
    }])
  })
  it('p 1, ps 128', async () => {
    const res = await sat.get('/api/image-list').expect(200)
    const r = res.body.list
    expect(r.length).toBe(10)
    expect(r[0].id).toBe(10)
    expect(r[1].id).toBe(9)
    expect(r[2].id).toBe(8)
    expect(r[9].id).toBe(1)
  })
  it('p 1, ps 4', async () => {
    const res = await sat.get('/api/image-list?p=1&ps=4').expect(200)
    const r = res.body.list
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(10)
    expect(r[3].id).toBe(7)
  })
  it('p 2, ps 4', async () => {
    const res = await sat.get('/api/image-list?p=2&ps=4').expect(200)
    const r = res.body.list
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('p 3, ps 4', async () => {
    const res = await sat.get('/api/image-list?p=3&ps=4').expect(200)
    const r = res.body.list
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(2)
    expect(r[1].id).toBe(1)
  })
  it('d 20030607, ps 4', async () => {
    const res = await sat.get('/api/image-list?d=2003-06-07&ps=4').expect(200)
    const r = res.body.list
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('d null', async () => {
    const res = await sat.get('/api/image-list?d=null').expect(200)
    const r = res.body.list
    expect(r.length).toBe(10)
    expect(r[0].id).toBe(10)
    expect(r[1].id).toBe(9)
    expect(r[2].id).toBe(8)
    expect(r[9].id).toBe(1)
  })

})
