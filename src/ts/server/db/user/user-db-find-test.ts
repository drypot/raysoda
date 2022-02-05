import { UserDB } from '@server/db/user/user-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { insertUserFix4, USER1 } from '@server/db/user/fixture/user-fix'

describe('UserDB Find', () => {

  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('find by id works', async () => {
    const user = await udb.getUserById(1)
    expect(user?.id).toBe(1)
  })
  it('find by invalid id fails', async () => {
    const user = await udb.getUserById(999)
    expect(user).toBe(undefined)
  })
  it('find by email works', async () => {
    const user = await udb.getUserByEmail(USER1.email)
    expect(user?.id).toBe(1)
  })
  it('find by invalid mail fails', async () => {
    const user = await udb.getUserByEmail('userx@mail.test')
    expect(user).toBe(undefined)
  })
  it('find by name works', async () => {
    const user = await udb.getUserByName(USER1.name)
    expect(user?.id).toBe(1)
  })
  it('find by invalid name fails', async () => {
    const user = await udb.getUserByName('namex')
    expect(user).toBe(undefined)
  })
  it('find by home works', async () => {
    const user = await udb.getUserByHome(USER1.home)
    expect(user?.id).toBe(1)
  })
  it('find by invalid home fails', async () => {
    const user = await udb.getUserByHome('homex')
    expect(user).toBe(undefined)
  })

})
