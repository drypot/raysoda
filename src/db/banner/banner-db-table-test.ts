import { closeAllObjects, initObjectContext } from '../../oman/oman.js'
import { DB, getDatabase } from '../db/db.js'
import { BannerDB, getBannerDB } from './banner-db.js'

describe('ValueDB Table', () => {

  let db: DB
  let bdb: BannerDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    bdb = await getBannerDB()
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.tableExists('banner')).toBeTrue()
  })
  it('drop table', async () => {
    await bdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.tableExists('banner')).toBeFalse()
  })

})
