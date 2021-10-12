import { UserDB } from '../../db/user/user-db'
import { ImageDB } from '../../db/image/image-db'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { leftTicket } from './image-upload-service'
import { newImage } from '../../_type/image'
import { ImageFileManager } from '../../file/_fileman'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { RaySodaFileManager } from '../../file/raysoda-fileman'

describe('imageUploadService leftTicket', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetObject('RaySodaFileManager') as RaySodaFileManager
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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


