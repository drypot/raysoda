import { loadConfig } from './config.mjs'

describe('loadConfig', () => {
  it('should succeed', () => {
    const config = loadConfig('src/base/config-test-fixture.json')
    expect(config.appName).toBe('ConfigTest')
    expect(config.appNamel).toBe('configtest')
    expect(config.dev).toBeTrue()
    expect(config.xxx).toBeUndefined()
  })
})
