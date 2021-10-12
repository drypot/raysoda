import { CounterDB } from './counter-db'
import { newDateStringNoTime } from '../../_util/date2'
import { dupe } from '../../_util/object2'
import { objManCloseAllObjects, objManGetObject, objManNewSessionForTest } from '../../objman/object-man'

describe('CounterDB Increase', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    objManNewSessionForTest()
    cdb = await objManGetObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await objManCloseAllObjects()
  })

  const ds = newDateStringNoTime(new Date())

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('increase 1', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('find 1', async () => {
    const c = await cdb.findCounter('cnt1', ds)
    const d = newDateStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 1 })
  })
  it('increase 2', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('increase 3', async () => {
    await cdb.increaseCounter('cnt1')
  })
  it('find 2', async () => {
    const c = await cdb.findCounter('cnt1', ds)
    const d = newDateStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 3 })
  })

})
