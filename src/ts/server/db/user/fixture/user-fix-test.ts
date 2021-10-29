import { userFixInsert1, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('User Fixture', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  describe('userFixInsert1', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('user1 not exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(undefined)
    })
    it('insert fixture 1', async () => {
      await userFixInsert1(udb)
    })
    it('user1 exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('userFixInsert4', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('fill table with fixture 4', async () => {
      await userFixInsert4(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.findUserById(1)
      expect(user?.name).toBe('user1')
      expect(user?.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.findUserById(3)
      expect(user?.name).toBe('user3')
      expect(user?.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.findUserById(4)
      expect(user?.name).toBe('admin')
      expect(user?.admin).toBe(true)
    })
  })

})
