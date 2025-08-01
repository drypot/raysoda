import { ADMIN, insertUserFix1, insertUserFix4, USER1, USER3 } from './user-fix.js'
import { closeAllObjects, getObject, initObjectContext } from '../../../oman/oman.js'
import { UserDB } from '../user-db.js'

describe('User Fixture', () => {

  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  describe('userFixInsert1', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('user1 not exists', async () => {
      let user = await udb.getUserById(1)
      expect(user).toBe(undefined)
    })
    it('insert fixture 1', async () => {
      await insertUserFix1(udb)
    })
    it('user1 exists', async () => {
      let user = await udb.getUserById(1)
      expect(user?.name).toBe(USER1.name)
    })
  })

  describe('userFixInsert4', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('fill table with fixture 4', async () => {
      await insertUserFix4(udb)
    })
    it('user1 should exist', async () => {
      let user = await udb.getUserById(1)
      expect(user?.name).toBe(USER1.name)
      expect(user?.admin).toBe(false)
    })
    it('user3 should exist', async () => {
      let user = await udb.getUserById(3)
      expect(user?.name).toBe(USER3.name)
      expect(user?.admin).toBe(false)
    })
    it('admin should exist', async () => {
      let user = await udb.getUserById(4)
      expect(user?.name).toBe(ADMIN.name)
      expect(user?.admin).toBe(true)
    })
  })

})
