import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { USER1, userFixInsert4 } from '@server/db/user/fixture/user-fix'

describe('UserDB.findUser', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert4(udb)
  })
  it('find by id works', async () => {
    const user = await udb.findUserById(1)
    expect(user?.id).toBe(1)
  })
  it('find by invalid id fails', async () => {
    const user = await udb.findUserById(999)
    expect(user).toBe(undefined)
  })
  it('find by email works', async () => {
    const user = await udb.findUserByEmail(USER1.email)
    expect(user?.id).toBe(1)
  })
  it('find by invalid mail fails', async () => {
    const user = await udb.findUserByEmail('userx@mail.test')
    expect(user).toBe(undefined)
  })
  it('find by name works', async () => {
    const user = await udb.findUserByName(USER1.name)
    expect(user?.id).toBe(1)
  })
  it('find by invalid name fails', async () => {
    const user = await udb.findUserByName('namex')
    expect(user).toBe(undefined)
  })
  it('find by home works', async () => {
    const user = await udb.findUserByHome(USER1.home)
    expect(user?.id).toBe(1)
  })
  it('find by invalid home fails', async () => {
    const user = await udb.findUserByHome('homex')
    expect(user).toBe(undefined)
  })

})
