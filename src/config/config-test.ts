import { config, loadConfig } from './config.js'

describe('loadConfig', () => {
  it('should work', () => {
    loadConfig('src/config/config-test-fixture.json')
    expect(config.appName).toBe('ConfigTest')
    expect(config.appNamel).toBe('configtest')
    expect(config.dev).toBeTruthy()
  })
})
