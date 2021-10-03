import { loadConfigSync } from '../../_util/config-loader.js'
import { getImageMetaOfFile } from '../../file/magick/magick2.js'
import { ImageUpdateForm, ImageUploadForm } from '../../_type/image-form.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/fixture/user-fix.js'
import { UserDB } from '../../db/user/user-db.js'
import { DB } from '../../db/_db/db.js'
import { imageUploadService } from './image-upload-service.js'
import { imageUpdateService } from './image-update-service.js'
import { DrypotFileManager } from '../../file/drypot-fileman.js'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'

describe('imageUpdateService Drypot', () => {

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
  it('upload', async () => {
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
  it('update', async () => {
    const form: ImageUpdateForm = { comment: 'c2', file: 'sample/svg-sample-2.svg' }
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, 1, form, err)
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
    expect(meta.format).toBe('svg')
  })

})
