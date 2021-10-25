import { copyFile } from 'fs/promises'
import { constants, existsSync } from 'fs'
import { ImageUploadForm } from '@common/type/image-form'
import { imageDeleteService } from '@server/domain/image/_service/image-delete-service'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { IMAGE_NOT_EXIST } from '@common/type/error-const'
import { ErrorConst } from '@common/type/error'
import { ImageDB } from '@server/db/image/image-db'
import { ADMIN, insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { RapixelFileManager } from '@server/file/rapixel-fileman'
import { imageUploadService } from '@server/domain/image/_service/image-upload-service'

describe('imageDeleteService Rapixel', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/rapixel-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetObject('RapixelFileManager') as RapixelFileManager
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
    await copyFile('sample/3840x2160.jpg', 'tmp/3840x2160.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUploadForm = { now: new Date(), comment: 'c', file: 'tmp/3840x2160.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(1)
  })
  it('check file 1', async () => {
    expect(existsSync(ifm.getPathFor(1, 4096))).toBe(true)
  })
  it('delete 1', async () => {
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, ADMIN, 1, err)
    expect(err.length).toBe(0)
  })
  it('check file 1 after delete', async () => {
    expect(existsSync(ifm.getPathFor(1, 4096))).toBe(false)
  })
  it('delete 1 again', async () => {
    const err: ErrorConst[] = []
    await imageDeleteService(idb, ifm, ADMIN, 1, err)
    expect(err).toContain(IMAGE_NOT_EXIST)
  })

})
