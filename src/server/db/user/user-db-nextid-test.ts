import { UserDB } from './user-db'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('UserDB.*NextId', () => {

  let udb: UserDB

  beforeAll(async () => {
    objManNewSessionForTest()
    udb = await objManGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(1)
    expect(udb.getNextId()).toBe(2)
    expect(udb.getNextId()).toBe(3)
  })
  it('set next user id', () => {
    udb.setNextId(10)
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(10)
    expect(udb.getNextId()).toBe(11)
  })

})
