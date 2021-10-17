import { CounterDB } from '@server/db/counter/counter-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { dupe } from '@common/util/object2'

describe('CounterDB List', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
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
  it('list 1', async () => {
    const r = await cdb.findCounterList('cnt1', '2003-01-18', '2003-01-20')
    expect(dupe(r)).toEqual([
      { id: 'cnt1', d: '2003-01-18', c: 20 },
      { id: 'cnt1', d: '2003-01-19', c: 30 },
      { id: 'cnt1', d: '2003-01-20', c: 40 },
    ])
  })
  it('list 2', async () => {
    const r = await cdb.findCounterList('cnt2', '2003-01-10', '2003-01-17')
    expect(dupe(r)).toEqual([
      { id: 'cnt2', d: '2003-01-17', c: 10 },
    ])
  })
  it('list 3', async () => {
    const r = await cdb.findCounterList('cnt2', '2009-00-00', '2010-00-00')
    expect(dupe(r)).toEqual([])
  })
  it('list undefined', async () => {
    const r = await cdb.findCounterList('cntx', '2009-00-00', '2010-00-00')
    expect(dupe(r)).toEqual([])
  })

})
