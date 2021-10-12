import { ImageUpdateForm, ImageUploadForm } from '../../_type/image-form'
import { ImageFileManager } from '../../file/_fileman'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4, USER1, USER2 } from '../../db/user/fixture/user-fix'
import { UserDB } from '../../db/user/user-db'
import { RaySodaFileManager } from '../../file/raysoda-fileman'
import { imageUploadService } from './image-upload-service'
import { imageUpdateService } from './image-update-service'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { NOT_AUTHORIZED } from '../../_type/error-const'

describe('imageUpdateService Permission', () => {

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
  it('upload image', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(1)
  })
  it('update by USER1 works', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, USER1, 1, form, err)
    expect(err.length).toBe(0)
  })
  it('update by USER2 fails', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, USER2, 1, form, err)
    expect(err).toContain(NOT_AUTHORIZED)
  })
  it('update by ADMIN works', async () => {
    const form: ImageUpdateForm = { comment: 'c2' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
    expect(err.length).toBe(0)
  })

})
