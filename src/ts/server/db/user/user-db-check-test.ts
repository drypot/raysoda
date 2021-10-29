import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { newUser } from '@common/type/user'

describe('UserDB.*Is*', () => {

  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  describe('nameIsDupe', () => {
    it('init db', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('insert for name dupe test', async () => {
      const user = newUser({ id: 1, name: 'name1' })
      await udb.insertUser(user)
    })
    it('dupe, true', async () => {
      const dupe = await udb.nameIsDupe(0, 'name1')
      expect(dupe).toBe(true)
    })
    it('dupe case, true', async () => {
      const dupe = await udb.nameIsDupe(0, 'NAME1')
      expect(dupe).toBe(true)
    })
    it('not dupe, false', async () => {
      const dupe = await udb.nameIsDupe(0, 'namex')
      expect(dupe).toBe(false)
    })
    it('self, false', async () => {
      const dupe = await udb.nameIsDupe(1, 'name1')
      expect(dupe).toBe(false)
    })
  })

  describe('homeIsDupe', () => {
    it('init db', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('insert for name dupe test', async () => {
      const user = newUser({ id: 1, home: 'home1' })
      await udb.insertUser(user)
    })
    it('dupe, true', async () => {
      const dupe = await udb.homeIsDupe(0, 'home1')
      expect(dupe).toBe(true)
    })
    it('dupe case, true', async () => {
      const dupe = await udb.homeIsDupe(0, 'HOME1')
      expect(dupe).toBe(true)
    })
    it('not dupe, false', async () => {
      const dupe = await udb.homeIsDupe(0, 'homex')
      expect(dupe).toBe(false)
    })
    it('self, false', async () => {
      const dupe = await udb.homeIsDupe(1, 'home1')
      expect(dupe).toBe(false)
    })
  })

  describe('emailIsDupe', () => {
    it('init db', async () => {
      await udb.dropTable()
      await udb.createTable()
    })
    it('insert for name dupe test', async () => {
      const user = newUser({ id: 1, email: 'mail1@mail.test' })
      await udb.insertUser(user)
    })
    it('dupe, true', async () => {
      const dupe = await udb.emailIsDupe(0, 'mail1@mail.test')
      expect(dupe).toBe(true)
    })
    it('dupe case, true', async () => {
      const dupe = await udb.emailIsDupe(0, 'MAIL1@MAIL.TEST')
      expect(dupe).toBe(true)
    })
    it('not dupe, false', async () => {
      const dupe = await udb.emailIsDupe(0, 'mailx@mail.test')
      expect(dupe).toBe(false)
    })
    it('self, false', async () => {
      const dupe = await udb.emailIsDupe(1, 'mail1@mail.test')
      expect(dupe).toBe(false)
    })
  })

})
