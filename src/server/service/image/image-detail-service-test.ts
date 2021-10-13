import { UserDB } from '../../db/user/user-db'
import { ImageFileManager } from '../../file/_fileman'
import { ImageUploadForm } from '../../_type/image-form'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { RaySodaFileManager } from '../../file/raysoda-fileman'
import { imageUploadService } from './image-upload-service'
import { imageDetailService } from './image-detail-service'
import { ErrorConst } from '../../_type/error'
import { newDateString } from '../../_util/date2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { IMAGE_NOT_EXIST } from '../../_type/error-const'

describe('imageDetailService', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
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

  let now: Date

  it('upload image', async () => {
    now = new Date
    const form: ImageUploadForm = { now: now, comment: 'c1', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(1)
  })
  it('get image 1 by user1', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, USER1, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: newDateString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('get image 1 by user2', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, USER2, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: newDateString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: false // ***
    })
  })
  it('get image 1 by admin', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, ADMIN, 1, err)
    if (!image) throw new Error()
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: 0,
      cdateStr: newDateString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('get image fails if id invalid', async () => {
    const err: ErrorConst[] = []
    const image = await imageDetailService(udb, idb, ifm, USER1, 99, err)
    expect(err).toContain(IMAGE_NOT_EXIST)
  })

})
