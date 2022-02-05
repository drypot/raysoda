import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman'
import { DB } from '../_db/db'
import { BannerDB } from '@server/db/banner/banner-db'

describe('ValueDB Table', () => {

  let db: DB
  let bdb: BannerDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    bdb = await getObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.getTable('banner')).toBeDefined()
  })
  it('drop table', async () => {
    await bdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.getTable('banner')).toBeUndefined()
  })

})
