import { userFixInsert1 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserDB.*Is*', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await userFixInsert1(udb)
  })

  describe('nameIsDupe', () => {
    it('false if not dupe', async () => {
      const dupe = await udb.nameIsDupe(0, 'User X')
      expect(dupe).toBe(false)
    })
    it('false if same entity', async () => {
      const dupe = await udb.nameIsDupe(1, 'User 1')
      expect(dupe).toBe(false)
    })
    it('true if dupe', async () => {
      const dupe = await udb.nameIsDupe(0, 'User 1')
      expect(dupe).toBe(true)
    })
  })

  describe('homeIsDupe', () => {
    it('false if not dupe', async () => {
      const dupe = await udb.homeIsDupe(0, 'userx')
      expect(dupe).toBe(false)
    })
    it('false if same entity', async () => {
      const dupe = await udb.homeIsDupe(1, 'user1')
      expect(dupe).toBe(false)
    })
    it('true if dupe', async () => {
      const dupe = await udb.homeIsDupe(0, 'user1')
      expect(dupe).toBe(true)
    })
  })

  describe('emailIsDupe', () => {
    it('false if not dupe', async () => {
      const dupe = await udb.emailIsDupe(0, 'userx@mail.test')
      expect(dupe).toBe(false)
    })
    it('false if same entity', async () => {
      const dupe = await udb.emailIsDupe(1, 'user1@mail.test')
      expect(dupe).toBe(false)
    })
    it('true if dupe', async () => {
      const dupe = await udb.emailIsDupe(0, 'user1@mail.test')
      expect(dupe).toBe(true)
    })
  })

})
