import { ValueDB } from './value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('ValueDB Value', () => {

  let vdb: ValueDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    vdb = await omanGetObject('ValueDB') as ValueDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
  })
  it('find undefined value', async () => {
    const v = await vdb.findValue('value1')
    expect(v).toBe(undefined)
  })
  it('insert value', async () => {
    await vdb.updateValue('s1', 'value1')
  })
  it('find value', async () => {
    const v = await vdb.findValue('s1')
    expect(v).toBe('value1')
  })
  it('updates value', async () => {
    await vdb.updateValue('s1', 'value2')
  })
  it('find value', async () => {
    const v = await vdb.findValue('s1')
    expect(v).toBe('value2')
  })
  it('update with undefined', async () => {
    await vdb.updateValue('s1', undefined)
    const v = await vdb.findValue('s1')
    expect(v).toBe(undefined)
  })
  it('update with empty string', async () => {
    await vdb.updateValue('empty', '')
    const v = await vdb.findValue('empty')
    expect(v).toBe('')
  })
  it('update with number', async () => {
    await vdb.updateValue('n1', 123)
    const v = await vdb.findValue('n1')
    expect(v).toBe(123)
  })
  it('update with 0', async () => {
    await vdb.updateValue('zero', 0)
    const v = await vdb.findValue('zero')
    expect(v).toBe(0)
  })
  it('update with object', async () => {
    await vdb.updateValue('o', { p1: 123, p2: 456 })
    const v = await vdb.findValue('o')
    expect(v).toEqual({ p1: 123, p2: 456 })
  })
  it('update with empty object', async () => {
    await vdb.updateValue('emptyObj', {})
    const v = await vdb.findValue('emptyObj')
    expect(v).toEqual({})
  })
  it('update with null', async () => {
    await vdb.updateValue('null', null)
    const v = await vdb.findValue('null')
    expect(v).toBe(null)
  })

})