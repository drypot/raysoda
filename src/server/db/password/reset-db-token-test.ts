import { ResetDB } from './reset-db'
import { ResetToken } from '../../_type/password'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('ResetDB Token', () => {

  let rdb: ResetDB

  beforeAll(async () => {
    omanNewSessionForTest()
    rdb = await omanGetObject('ResetDB') as ResetDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await rdb.dropTable()
    await rdb.createTable()
  })
  it('find returns nothing', async () => {
    const r = await rdb.findByUuid('uuid1')
    expect(r?.email).toBe(undefined)
  })
  it('insert', async () => {
    const r: ResetToken = {
      uuid: 'uuid1',
      email: 'user1@mail.test',
      token: 'token1'
    }
    await rdb.insert(r)
  })
  it('find by uuid', async () => {
    const r = await rdb.findByUuid('uuid1')
    expect(r?.email).toBe('user1@mail.test')
  })
  it('find by email', async () => {
    const r = await rdb.findByEmail('user1@mail.test')
    expect(r?.email).toBe('user1@mail.test')
  })
  it('delete', async () => {
    await rdb.deleteByEmail('user1@mail.test')
  })
  it('find returns nothing', async () => {
    const r3 = await rdb.findByUuid('uuid1')
    expect(r3?.email).toBe(undefined)
  })

})
