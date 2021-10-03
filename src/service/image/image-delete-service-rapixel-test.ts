import { loadConfigSync } from '../../_util/config-loader.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUploadForm } from '../../_type/image-form.js'
import { constants, existsSync } from 'fs'
import { ImageDB } from '../../db/image/image-db.js'
import { ADMIN, insertUserFix4 } from '../../db/user/fixture/user-fix.js'
import { UserDB } from '../../db/user/user-db.js'
import { DB } from '../../db/_db/db.js'
import { imageUploadService } from './image-upload-service.js'
import { imageDeleteService } from './image-delete-service.js'
import { RapixelFileManager } from '../../file/rapixel-fileman.js'
import { copyFile } from 'fs/promises'
import { Config } from '../../_type/config.js'
import { ErrorConst } from '../../_type/error.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'

describe('imageDeleteService Rapixel', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/rapixel-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
    ifm = RapixelFileManager.from(config)
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
