import { loadConfig } from './config.js'

describe('loadConfig', () => {
  it('should work', () => {
    const config = loadConfig('config/test.json')
    expect(config.appName).toBe('Test')
    expect(config.appNamel).toBe('test')
    expect(config.dev).toBeTruthy()
  })
})
