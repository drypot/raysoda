import { CounterDB } from '@server/db/counter/counter-db'
import { newDateStringNoTime } from '@common/util/date2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { counterIncService } from '@server/service/counter/counter-service'
import { dupe } from '@common/util/object2'

describe('Counter Api Inc', () => {

  let cdb: CounterDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
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
