import { CounterDB } from '../../db/counter/counter-db'
import { counterListService } from './counter-service'
import { dupe } from '../../_util/object2'
import { omanCloseAllObjects, omanGetObject, omanNewSessionForTest } from '../../oman/oman'

describe('Counter Api List', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSessionForTest()
    cdb = await omanGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('insert fix', async () => {
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 18), 20)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 19), 30)
    await cdb.replaceCounter('cnt1', new Date(2003, 0, 20), 40)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 17), 10)
    await cdb.replaceCounter('cnt2', new Date(2003, 0, 18), 20)
  })
  it('get list', async () => {
    const r = await counterListService(cdb, 'cnt1', '2003-01-18', '2003-01-20')
    expect(dupe(r)).toEqual([
      { id: 'cnt1', d: '2003-01-18', c: 20 },
      { id: 'cnt1', d: '2003-01-19', c: 30 },
      { id: 'cnt1', d: '2003-01-20', c: 40 },
    ])
  })

})
