import { configFrom } from './config.js'

describe('loadConfig', () => {
  it('should work', () => {
    const config = configFrom('config/config-test.json')
    expect(config.appName).toBe('Test')
    expect(config.appNamel).toBe('test')
    expect(config.dev).toBeTruthy()
  })
  it('can throw exception', () => {
    expect(() => { configFrom('config/not-exist.json') }).toThrow()
  })
})