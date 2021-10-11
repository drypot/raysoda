import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../../db/_db/db'
import { UserDB } from '../../db/user/user-db'
import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/fileman'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { ImageUploadForm } from '../../_type/image-form'
import { getImageMetaOfFile } from '../../file/magick/magick2'
import { imageUploadService } from './image-upload-service'
import { DrypotFileManager } from '../../file/drypot-fileman'
import { IMAGE_TYPE } from '../../_type/error-image'
import { Config } from '../../_type/config'
import { ErrorConst } from '../../_type/error'

describe('imageUploadService Drypot', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/drypot-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = DrypotFileManager.from(config)
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
  it('upload fails if jpeg', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: '', file: 'sample/640x360.jpg', }
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, 1, form, err)
    expect(err).toContain(IMAGE_TYPE)
  })
  it('upload 1', async () => {
    const form: ImageUploadForm = { now: new Date(), comment: 'c1', file: 'sample/svg-sample.svg', }
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
    expect(meta.format).toBe('svg')
  })

})


