import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../../db/_db/db'
import { UserDB } from '../../db/user/user-db'
import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/fileman'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { ImageUploadForm } from '../../_type/image-form'
import { getImageMetaOfFile } from '../../file/magick/magick2'
import { imageUploadService } from './image-upload-service'
import { OsokyFileManager } from '../../file/osoky-fileman'
import { IMAGE_SIZE } from '../../_type/error-image'
import { Config } from '../../_type/config'
import { ErrorConst } from '../../_type/error'

describe('imageUploadService Osoky', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/osoky-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = OsokyFileManager.from(config)
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable(false)
  })
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })
  it('upload fails if image is too small', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(err).toContain(IMAGE_SIZE)
  })
  it('upload 1', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/4096x2304.jpg', }
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
    expect(meta.width).toBe(2048)
    expect(meta.height).toBe(2048)
  })
  it('upload 2', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c2', file: 'sample/1280x720.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(id).toBe(2)
  })
  it('check db', async () => {
    const r = await idb.findImage(2)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(2))
    expect(meta.width).toBe(720)
    expect(meta.height).toBe(720)
  })

})

