import { UserDB } from './user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { DB } from '../_db/db'

describe('UserDB.*Table', () => {

  let db: DB
  let udb: UserDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    udb = await omanGetObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('drop table', async () => {
    await udb.dropTable()
  })
  it('create table', async () => {
    await udb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('user')).toBeDefined()
  })
  it('drop table', async () => {
    await udb.dropTable()
  })
  it('table not exists', async () => {
    expect(await db.findTable('user')).toBeUndefined()
  })

})
