import { UserDB } from '../../db/user/user-db'
import { ADMIN, insertUserFix1, USER1 } from '../../db/user/fixture/user-fix'
import { userDetailService } from './user-detail-service'
import { UserCache } from '../../db/user/cache/user-cache'
import { dateNull } from '../../_util/date2'
import { ErrorConst } from '../../_type/error'
import { GUEST } from '../../_type/user'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('userDetailService', () => {

  let udb: UserDB
  let uc: UserCache

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    uc = await omanGetObject('UserCache') as UserCache
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix1(udb)
  })
  it('get user1 by guest', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, GUEST, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: dateNull,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get user1 by user1', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, USER1, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: USER1.adate,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get user1 by admin', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, ADMIN, 1, err)
    if (!user) throw new Error()
    expect(user as any).toEqual({
      id: 1,
      name: 'User 1',
      home: 'user1',
      status: 'v',
      admin: false,
      profile: '',
      cdate: USER1.cdate,
      adate: USER1.adate,
      pdate: USER1.pdate,
      cdateNum: 0,
      adateNum: 0,
      pdateNum: 0,
    })
  })
  it('get invalid', async () => {
    const err: ErrorConst[] = []
    const user = await userDetailService(uc, USER1, 99, err)
    expect(user).toBeUndefined()
  })

})
