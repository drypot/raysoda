import { UserDB } from './user-db'
import { newUser } from '../../_type/user'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('UserDB.findUser*', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSessionForTest()
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('user not exists', async () => {
    const user = await udb.findUserById(1)
    expect(user?.id).toBe(undefined)
  })
  it('insert user', async () => {
    const user = newUser({ id: 1, name: 'User 1', home: 'user1', email: 'user1@mail.test' })
    await udb.insertUser(user)
  })
  it('user exists', async () => {
    const user = await udb.findUserById(1)
    expect(user?.id).toBe(1)
  })
  it('user 999 not exists', async () => {
    const user = await udb.findUserById(999)
    expect(user?.id).toBe(undefined)
  })
  it('user user1@mail.test exists', async () => {
    const user = await udb.findUserByEmail('user1@mail.test')
    expect(user?.id).toBe(1)
  })
  it('user userX@mail.test not exists', async () => {
    const user = await udb.findUserByEmail('userx@mail.test')
    expect(user?.id).toBe(undefined)
  })
  it('user1 exists', async () => {
    const user = await udb.findUserByHome('user1')
    expect(user?.id).toBe(1)
  })
  it('userX not exists', async () => {
    const user = await udb.findUserByHome('userX')
    expect(user?.id).toBe(undefined)
  })

})
