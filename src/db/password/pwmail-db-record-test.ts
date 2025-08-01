import { PwMailDB } from './pwmail-db.js'
import { type PasswordMailLog } from '../../common/type/password.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'

describe('PwMailDB Token', () => {

  let rdb: PwMailDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    rdb = await getObject('PwMailDB') as PwMailDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  const random = 'x'.repeat(32)
  const now = new Date()

  it('init table', async () => {
    await rdb.dropTable()
    await rdb.createTable()
  })
  it('insert', async () => {
    const r: PasswordMailLog = {
      id: rdb.getNextId(),
      email: 'user1@mail.test',
      random: random,
      cdate: now
    }
    await rdb.insertLog(r)
  })
  it('find by id', async () => {
    const r = await rdb.getLogById(1)
    expect(r?.id).toBe(1)
    expect(r?.email).toBe('user1@mail.test')
    expect(r?.random).toBe(random)
    expect(r?.cdate).toEqual(now)
  })
  it('find by email', async () => {
    const r = await rdb.getLogByEmail('user1@mail.test')
    expect(r?.id).toBe(1)
    expect(r?.email).toBe('user1@mail.test')
    expect(r?.random).toBe(random)
    expect(r?.cdate).toEqual(now)
  })
  it('delete', async () => {
    await rdb.deleteLogByEmail('user1@mail.test')
  })
  it('find returns nothing', async () => {
    const r = await rdb.getLogByEmail('user1@mail.test')
    expect(r).toBe(undefined)
  })

})
