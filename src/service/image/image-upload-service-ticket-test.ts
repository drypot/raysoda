import { loadConfigSync } from '../../_util/config-loader.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { insertUserFix4 } from '../../db/user/fixture/user-fix.js'
import { leftTicket } from './image-upload-service.js'
import { newImage } from '../../_type/image.js'
import { Config } from '../../_type/config.js'

describe('imageUploadService leftTicket', () => {
  let config: Config
  let db: DB
  let udb: UserDB
  let idb: ImageDB

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    idb = ImageDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
  })

  async function addImage(hours: number) {
    await idb.insertImage(newImage({
      id: idb.getNextId(),
      uid: 1,
      cdate: new Date(Date.now() - (hours * 60 * 60 * 1000))
    }))
  }

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable(false)
  })
  it('check ticket, when no image', async () => {
    const { ticket, hour } = await leftTicket(idb, 1, new Date())
    expect(ticket).toBe(3)
  })
  it('add 19 hours old image', async () => {
    await addImage(19)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await leftTicket(idb, 1, new Date())
    expect(ticket).toBe(3)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await leftTicket(idb, 1, new Date())
    expect(ticket).toBe(2)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await leftTicket(idb, 1, new Date())
    expect(ticket).toBe(1)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await leftTicket(idb, 1, new Date())
    expect(ticket).toBe(0)
    expect(hour).toBe(3)
  })
})


