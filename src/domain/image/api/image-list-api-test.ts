import { DB, getDatabase } from '../../../db/db/db.js'
import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useImageListApi } from './image-list-api.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'

describe('ImageListApi', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    udb = await getUserDB()
    idb = await getImageDB()
    ifm = await getImageFileManager(getConfig().appNamel)
    express2 = await getExpress2()
    await useImageListApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
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
    const res = await agent.get('/api/image-list').expect(200)
    expect(res.body.list.length).toBe(10)
    expect(res.body.prev).toBe(null)
    expect(res.body.next).toBe(null)
  })

  it('ps 1', async () => {
    const res = await agent.get('/api/image-list?ps=1').expect(200)
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
    const res = await agent.get('/api/image-list?pb=8&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(8)
    expect(res.body.list[1].id).toBe(7)
    expect(res.body.list[2].id).toBe(6)
    expect(res.body.prev).toBe(9)
    expect(res.body.next).toBe(5)
  })

  it('pe 5, ps 3', async () => {
    const res = await agent.get('/api/image-list?pe=5&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(7)
    expect(res.body.list[1].id).toBe(6)
    expect(res.body.list[2].id).toBe(5)
    expect(res.body.prev).toBe(8)
    expect(res.body.next).toBe(4)
  })

  it('uid 2, ps 3', async () => {
    const res = await agent.get('/api/image-list?uid=2&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(5)
    expect(res.body.list[1].id).toBe(4)
    expect(res.body.list[2].id).toBe(3)
    expect(res.body.prev).toBe(null)
    expect(res.body.next).toBe(2)
  })

  it('d 2003 6 7, ps 3', async () => {
    const res = await agent.get('/api/image-list?d=2003-6-7&ps=3').expect(200)
    expect(res.body.list.length).toBe(3)
    expect(res.body.list[0].id).toBe(9)
    expect(res.body.list[1].id).toBe(8)
    expect(res.body.list[2].id).toBe(7)
    expect(res.body.prev).toBe(10)
    expect(res.body.next).toBe(6)
  })

})
