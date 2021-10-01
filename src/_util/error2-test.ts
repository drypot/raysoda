import { getErrorConst } from './error2.js'

describe('getErrorDef', () => {
  it('1', () => {
    const err = getErrorConst('ERR', 'Message', 'Field')
    expect(err).toEqual({ name: 'ERR', message: 'Message', field: 'Field' })
  })
})
