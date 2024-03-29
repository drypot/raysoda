import { loadConfigSync } from '@common/util/config-loader'

describe('readConfigSync', () => {
  it('1', () => {
    const config = loadConfigSync('config/config-test.json')
    expect(config.appName).toBe('Test')
    expect(config.appNamel).toBe('test')
  })
  it('if file not found', () => {
    expect(() => {
      loadConfigSync('config/not-exist.json')
    }).toThrow()
  })
})
