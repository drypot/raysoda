import { CounterDB } from '@server/db/counter/counter-db'
import { dateToStringNoTime } from '@common/util/date2'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { dupe } from '@common/util/object2'

describe('CounterDB Increase', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    cdb = await getObject('CounterDB') as CounterDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  const ds = dateToStringNoTime(new Date())

  it('init table', async () => {
    await cdb.dropTable()
    await cdb.createTable()
  })
  it('increase 1', async () => {
    await cdb.incCounter('cnt1')
  })
  it('find 1', async () => {
    const c = await cdb.getCounter('cnt1', ds)
    const d = dateToStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 1 })
  })
  it('increase 2', async () => {
    await cdb.incCounter('cnt1')
  })
  it('increase 3', async () => {
    await cdb.incCounter('cnt1')
  })
  it('find 2', async () => {
    const c = await cdb.getCounter('cnt1', ds)
    const d = dateToStringNoTime(new Date())
    expect(dupe(c)).toEqual({ id: 'cnt1', d: d, c: 3 })
  })

})
