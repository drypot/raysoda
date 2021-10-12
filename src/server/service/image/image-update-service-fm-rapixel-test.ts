import { getImageMetaOfFile } from '../../file/magick/magick2'
import { ImageUpdateForm, ImageUploadForm } from '../../_type/image-form'
import { ImageFileManager } from '../../file/_fileman'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4 } from '../../db/user/fixture/user-fix'
import { UserDB } from '../../db/user/user-db'
import { imageUploadService } from './image-upload-service'
import { imageUpdateService } from './image-update-service'
import { RapixelFileManager } from '../../file/rapixel-fileman'
import { copyFile } from 'fs/promises'
import { constants } from 'fs'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { IMAGE_SIZE } from '../../_type/error-const'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('imageUpdateService Rapixel', () => {

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
  it('upload', async () => {
    // mogrify 가 소스를 업데이트한다.
    // tmp 로 복사해 놓고 쓴다.
    await copyFile('sample/5120x2880.jpg', 'tmp/5120x2880.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'tmp/5120x2880.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(8000)
    expect(r.comment).toBe('c1')
    expect(r.vers).toEqual([5120, 4096, 2560, 1280])
  })
  it('check file', async () => {
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 5120))).width).toBe(5120)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 4096))).width).toBe(4096)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 2560))).width).toBe(2560)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 1280))).width).toBe(1280)
  })
  it('update', async () => {
    await copyFile('sample/4096x2304.jpg', 'tmp/4096x2304.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUpdateForm = { comment: 'c2', file: 'tmp/4096x2304.jpg' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(8000)
    expect(r.comment).toBe('c2')
    expect(r.vers).toEqual([4096, 2560, 1280])
  })
  it('check file', async () => {
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 5120))).width).toBe(0)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 4096))).width).toBe(4096)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 2560))).width).toBe(2560)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 1280))).width).toBe(1280)
  })
  it('fails if image too small', async () => {
    await copyFile('sample/2560x1440.jpg', 'tmp/2560x1440.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUpdateForm = { comment: '', file: 'tmp/2560x1440.jpg' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
    expect(err).toContain(IMAGE_SIZE)
  })

})
