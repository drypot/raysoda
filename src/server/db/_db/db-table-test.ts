import { DB } from './db'
import { objManCloseAllObjects, objManGetObject, objManNewSession } from '../../objman/object-man'

describe('DB.*Table', () => {

  let db: DB

  beforeAll(async () => {
    objManNewSession('config/app-test.json')
    db = await objManGetObject('DB') as DB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  it('create table', async () => {
    await db.query('drop table if exists table1')
    await db.query('create table table1(id int)')
  })
  it('find table returns table', async () => {
    expect(await db.findTable('table1')).toBeDefined()
  })
  it('drop table', async () => {
    await db.query('drop table if exists table1')
  })
  it('find table returns nothing', async () => {
    expect(await db.findTable('table1')).toBeUndefined()
  })

})
