import { getImageMetaOfFile } from '../../file/magick/magick2'
import { ImageUpdateForm, ImageUploadForm } from '../../_type/image-form'
import { ImageFileManager } from '../../file/_fileman'
import { ImageDB } from '../../db/image/image-db'
import { ADMIN, insertUserFix4 } from '../../db/user/fixture/user-fix'
import { UserDB } from '../../db/user/user-db'
import { imageUploadService } from './image-upload-service'
import { imageUpdateService } from './image-update-service'
import { OsokyFileManager } from '../../file/osoky-fileman'
import { IMAGE_SIZE } from '../../_type/error-image'
import { ErrorConst } from '../../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('imageUpdateService Osoky', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/osoky-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetObject('OsokyFileManager') as OsokyFileManager
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
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/1280x720.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c1')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(720)
    expect(meta.height).toBe(720)
  })
  it('update', async () => {
    const form: ImageUpdateForm = { comment: 'c2', file: 'sample/4096x2304.jpg' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(2048)
    expect(meta.height).toBe(2048)
  })
  it('fails if image too small', async () => {
    const form: ImageUpdateForm = { comment: '', file: 'sample/640x360.jpg' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, ADMIN, 1, form, err)
    expect(err).toContain(IMAGE_SIZE)
  })

})
