import { CounterDB } from '@server/db/counter/counter-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { dupe } from '@common/util/object2'
import { DB } from '@server/db/_db/db'

describe('CounterDB Replace', () => {

  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    db = await omanGetObject('DB') as DB
    cdb = await omanGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('replace', async () => {
    await cdb.replaceCounter('cnt1', new Date(2021, 7, 15), 10)
  })
  it('check db', async () => {
    const r = await db.queryOne('select * from counter where id=? and d=?', ['cnt1', '2021-08-15'])
    expect(dupe(r)).toEqual({
      id: 'cnt1', d: '2021-08-15', c: 10
    })
  })
  it('find', async () => {
    const c = await cdb.getCounter('cnt1', '2021-08-15')
    expect(dupe(c)).toEqual({ id: 'cnt1', d: '2021-08-15', c: 10 })
  })

})
