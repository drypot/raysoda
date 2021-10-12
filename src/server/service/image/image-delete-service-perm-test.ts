import { ImageFileManager } from '../../file/_fileman'
import { ImageUploadForm } from '../../_type/image-form'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { UserDB } from '../../db/user/user-db'
import { RaySodaFileManager } from '../../file/raysoda-fileman'
import { imageUploadService } from './image-upload-service'
import { imageDeleteService } from './image-delete-service'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { NOT_AUTHORIZED } from '../../_type/error-const'

describe('imageDeleteService Permission', () => {

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

  it('upload 1', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(1)
  })
  it('delete by USER1 works', async () => {
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, USER1, 1, err)
    expect(err.length).toBe(0)
  })

  it('upload 2', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(2)
  })
  it('delete by USER2 fails', async () => {
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, USER2, 2, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })

  it('upload 3', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, USER1.id, form, err)
    expect(id).toBe(3)
  })
  it('delete by ADMIN works', async () => {
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, ADMIN, 3, err)
    expect(err.length).toBe(0)
  })

})
