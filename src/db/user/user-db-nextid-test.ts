import { UserDB } from './user-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../../oman/oman.js'

import './user-db.js'

describe('UserDB NextId', () => {

  let udb: UserDB

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(1)
    expect(udb.getNextId()).toBe(2)
    expect(udb.getNextId()).toBe(3)
  })
  it('set next user id', () => {
    udb.setNextId(10)
  })
  it('get next user id', () => {
    expect(udb.getNextId()).toBe(10)
    expect(udb.getNextId()).toBe(11)
  })

})
