import { newDateStringNoTime } from '../../_util/date2'
import { CounterDB } from '../../db/counter/counter-db'
import { counterIncService } from './counter-service'
import { dupe } from '../../_util/object2'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('Counter Api Inc', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSessionForTest()
    cdb = await omanGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  const d = newDateStringNoTime(new Date())

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('update', async () => {
    await counterIncService(cdb, 'abc')
  })
  it('check db', async () => {
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 1 })
  })
  it('update 2', async () => {
    await counterIncService(cdb, 'abc')
  })
  it('check db 2', async () => {
    const r = await cdb.findCounter('abc', d)
    expect(dupe(r)).toEqual({ id: 'abc', d: d, c: 2 })
  })

})
