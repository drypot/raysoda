import { exec2 } from '@common/util/exec2'

describe('exec', () => {
  it('printf', async () => {
    const r = await exec2('printf abc')
    expect(r).toBe('abc')
  })
  it('xxx', async () => {
    await expectAsync(exec2('xxx')).toBeRejected()
  })
})
