import { newErrorConst } from '@common/util/error2'

describe('newErrorConst', () => {
  it('1', () => {
    const err = newErrorConst('ERR', 'Message', 'Field')
    expect(err).toEqual({ name: 'ERR', message: 'Message', field: 'Field' })
  })
})
