import { readConfigSync } from './config-loader.js'

describe('readConfigSync', () => {
  it('1', () => {
    const config = readConfigSync('config/config-test.json')
    expect(config.appName).toBe('Test')
    expect(config.appNamel).toBe('test')
    expect(config.dev).toBeTruthy()
  })
  it('if file not found', () => {
    expect(() => {
      readConfigSync('config/not-exist.json')
    }).toThrow()
  })
})
