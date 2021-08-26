import { exec2 } from './exec2.js'

describe('exec', () => {
  it('printf', async () => {
    const r = await exec2('printf abc')
    expect(r).toBe('abc')
  })
  it('xxx', async () => {
    await expectAsync(exec2('xxx')).toBeRejected()
  })
})
