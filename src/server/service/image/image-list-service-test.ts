import { UserDB } from '../../db/user/user-db'
import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/_fileman'
import { RaySodaFileManager } from '../../file/raysoda-fileman'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { imageListByCdateService, imageListByUserService, imageListService } from './image-list-service'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { DB } from '../../db/_db/db'

describe('imageList*Service', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetObject('RaySodaFileManager') as RaySodaFileManager
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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
  it('p 1, ps 128', async () => {
    const r = await imageListService(udb, idb, ifm, 1, 128)
    expect(r.length).toBe(10)
    expect(r[0].id).toBe(10)
    expect(r[1].id).toBe(9)
    expect(r[2].id).toBe(8)
    expect(r[9].id).toBe(1)
  })
  it('p 1, ps 4', async () => {
    const r = await imageListService(udb, idb, ifm, 1, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(10)
    expect(r[3].id).toBe(7)
  })
  it('p 2, ps 4', async () => {
    const r = await imageListService(udb, idb, ifm, 2, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('p 3, ps 4', async () => {
    const r = await imageListService(udb, idb, ifm, 3, 4)
    expect(r.length).toBe(2)
    expect(r[0].id).toBe(2)
    expect(r[1].id).toBe(1)
  })
  it('d 20030607, ps 4', async () => {
    const r = await imageListByCdateService(udb, idb, ifm, new Date('2003-6-7'), 1, 4)
    expect(r.length).toBe(4)
    expect(r[0].id).toBe(6)
    expect(r[3].id).toBe(3)
  })
  it('u 1', async () => {
    const r = await imageListByUserService(udb, idb, ifm, 1, 1, 128)
    expect(r.length).toBe(5)
    expect(r[0].id).toBe(10)
    expect(r[3].id).toBe(7)
  })

})
