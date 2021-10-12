import { UserDB } from '../../db/user/user-db'
import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/_fileman'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { ImageUploadForm } from '../../_type/image-form'
import { getImageMetaOfFile } from '../../file/magick/magick2'
import { imageUploadService } from './image-upload-service'
import { RapixelFileManager } from '../../file/rapixel-fileman'
import { copyFile } from 'fs/promises'
import { constants } from 'fs'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { IMAGE_SIZE } from '../../_type/error-const'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('imageUploadService Rapixel', () => {

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
  it('upload fails if image is too small', async () => {
    // mogrify 가 소스를 업데이트한다.
    // tmp 로 복사해 놓고 쓴다.
    await copyFile('sample/2560x1440.jpg', 'tmp/2560x1440.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUploadForm = { now: new Date(), comment: '', file: 'tmp/2560x1440.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(err).toContain(IMAGE_SIZE)
  })
  it('upload fails if image is vertical', async () => {
    await copyFile('sample/2160x3840.jpg', 'tmp/2160x3840.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUploadForm = { now: new Date(), comment: '', file: 'tmp/2160x3840.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(err).toContain(IMAGE_SIZE)
  })
  it('upload 1', async () => {
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
  it('upload 2', async () => {
    await copyFile('sample/3840x2160.jpg', 'tmp/3840x2160.jpg', constants.COPYFILE_FICLONE)
    const form: ImageUploadForm = { now: new Date(), comment: 'c2', file: 'tmp/3840x2160.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(2)
  })
  it('check db', async () => {
    const r = await idb.findImage(2)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(8000)
    expect(r.comment).toBe('c2')
    expect(r.vers).toEqual([4096, 2560, 1280])
  })
  it('check file', async () => {
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 5120))).width).toBe(0)
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 4096))).width).toBe(4096)
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 2560))).width).toBe(2560)
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 1280))).width).toBe(1280)
  })

})


