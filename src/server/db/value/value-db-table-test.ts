import { ValueDB } from './value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { DB } from '../_db/db'

describe('ValueDB Table', () => {

  let db: DB
  let vdb: ValueDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    vdb = await omanGetObject('ValueDB') as ValueDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('persist')).toBeDefined()
  })
  it('drop table', async () => {
    await vdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.findTable('persist')).toBeUndefined()
  })

})
