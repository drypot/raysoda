import { UserDB } from '../user-db'
import { insertUserFix1, insertUserFix4 } from './user-fix'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'

describe('User Fixture', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  describe('insertUserFix1', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('user1 not exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(undefined)
    })
    it('insert fixture 1', async () => {
      await insertUserFix1(udb)
    })
    it('user1 exists', async () => {
      let user = await udb.findUserById(1)
      expect(user?.id).toBe(1)
    })
  })

  describe('insertUserFix4', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('fill table with fixture 4', async () => {
      await insertUserFix4(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.findUserById(1)
      expect(user?.home).toBe('user1')
      expect(user?.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.findUserById(3)
      expect(user?.home).toBe('user3')
      expect(user?.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.findUserById(4)
      expect(user?.home).toBe('admin')
      expect(user?.admin).toBe(true)
    })
  })

})
