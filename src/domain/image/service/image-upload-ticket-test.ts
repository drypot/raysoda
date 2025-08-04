import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { getRaySodaFileManager } from '../../../fileman/raysoda-fileman.ts'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.ts'
import { newImage } from '../../../common/type/image.ts'
import { getLeftTicket } from './image-upload.ts'

describe('LeftTicket', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    idb = await getImageDB()
    ifm = await getRaySodaFileManager()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
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
    await idb.createTable()
  })
  it('check ticket, when no image', async () => {
    const { ticket, hour } = await getLeftTicket(idb, 1, new Date())
    expect(ticket).toBe(3)
  })
  it('add 19 hours old image', async () => {
    await addImage(19)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await getLeftTicket(idb, 1, new Date())
    expect(ticket).toBe(3)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await getLeftTicket(idb, 1, new Date())
    expect(ticket).toBe(2)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await getLeftTicket(idb, 1, new Date())
    expect(ticket).toBe(1)
  })
  it('add 15 hours old image', async () => {
    await addImage(15)
  })
  it('check ticket', async () => {
    const { ticket, hour } = await getLeftTicket(idb, 1, new Date())
    expect(ticket).toBe(0)
    expect(hour).toBe(3)
  })

})


