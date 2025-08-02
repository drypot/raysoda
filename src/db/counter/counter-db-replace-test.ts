import { CounterDB } from './counter-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'
import { dupe } from '../../common/util/object2.js'
import { DB } from '../db/db.js'

import './counter-db.js'

describe('CounterDB Replace', () => {

  let db: DB
  let cdb: CounterDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    cdb = await getObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await closeAllObjects()
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
