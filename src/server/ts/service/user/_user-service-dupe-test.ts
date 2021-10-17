import { ErrorConst } from '@common/type/error'
import { checkEmailDupe, checkHomeDupe, checkNameDupe } from '@server/service/user/_user-service'
import { EMAIL_DUPE, HOME_DUPE, NAME_DUPE } from '@common/type/error-const'
import { insertUserFix1 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserService DupeCheck', () => {

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
    await insertUserFix1(udb)
  })

  describe('checkNameDupe', () => {
    it('err if in use', async () => {
      const err: ErrorConst[] = []
      await checkNameDupe(udb, 0, 'User 1', err)
      expect(err).toContain(NAME_DUPE)
    })
    it('err if in use 2', async () => {
      const err: ErrorConst[] = []
      await checkNameDupe(udb, 0, 'user1', err)
      expect(err).toContain(NAME_DUPE)
    })
    it('ok if available', async () => {
      const err: ErrorConst[] = []
      await checkNameDupe(udb, 0, 'alice', err)
      expect(err.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const err: ErrorConst[] = []
      await checkNameDupe(udb, 1, 'User 1', err)
      expect(err.length).toBe(0)
    })
    it('ok if same entity 2', async () => {
      const err: ErrorConst[] = []
      await checkNameDupe(udb, 1, 'user1', err)
      expect(err.length).toBe(0)
    })
  })

  describe('checkHomeDupe', () => {
    it('err if in use', async () => {
      const err: ErrorConst[] = []
      await checkHomeDupe(udb, 0, 'user1', err)
      expect(err).toContain(HOME_DUPE)
    })
    it('err if in use 2', async () => {
      const err: ErrorConst[] = []
      await checkHomeDupe(udb, 0, 'User 1', err)
      expect(err).toContain(HOME_DUPE)
    })
    it('ok if available', async () => {
      const err: ErrorConst[] = []
      await checkHomeDupe(udb, 0, 'alice', err)
      expect(err.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const err: ErrorConst[] = []
      await checkHomeDupe(udb, 1, 'User 1', err)
      expect(err.length).toBe(0)
    })
    it('ok if same entity 2', async () => {
      const err: ErrorConst[] = []
      await checkHomeDupe(udb, 1, 'user1', err)
      expect(err.length).toBe(0)
    })
  })

  describe('checkEmailDupe', () => {
    it('err if email in use', async () => {
      const err: ErrorConst[] = []
      await checkEmailDupe(udb, 0, 'user1@mail.test', err)
      expect(err).toContain(EMAIL_DUPE)
    })
    it('ok if available', async () => {
      const err: ErrorConst[] = []
      await checkEmailDupe(udb, 0, 'userx@mail.test', err)
      expect(err.length).toBe(0)
    })
    it('ok if same entity', async () => {
      const err: ErrorConst[] = []
      await checkEmailDupe(udb, 1, 'user1@mail.test', err)
      expect(err.length).toBe(0)
    })
  })

})
