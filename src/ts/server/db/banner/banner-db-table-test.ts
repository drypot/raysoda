import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'
import { DB } from '../_db/db'
import { BannerDB } from '@server/db/banner/banner-db'

describe('ValueDB Table', () => {

  let db: DB
  let bdb: BannerDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    bdb = await omanGetObject('BannerDB') as BannerDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
  })
  it('table exists', async () => {
    expect(await db.findTable('banner')).toBeDefined()
  })
  it('drop table', async () => {
    await bdb.dropTable()
  })
  it('table does not exist', async () => {
    expect(await db.findTable('banner')).toBeUndefined()
  })

})
