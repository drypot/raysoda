import { newErrorConst } from './error2.js'

describe('newErrorConst', () => {
  it('1', () => {
    const err = newErrorConst('ERR', 'Message', 'Field')
    expect(err).toEqual({ name: 'ERR', message: 'Message', field: 'Field' })
  })
})
