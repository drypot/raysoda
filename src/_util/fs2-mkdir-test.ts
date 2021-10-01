import { existsSync } from 'fs'
import { mkdirRecursive, mkdirRecursiveSync, rmRecursive, rmRecursiveSync } from './fs2.js'

// exists 는 deprecated 되었지만 existsSync 는 계속 유효하다.
// exists 대신 access 가 권장되기도 하는데
// 아래처럼 해야해서 번잡하다.
// await expectAsync(access(tdir)).toBeRejected()

const tdir = 'tmp/fs/'

describe('rm/mkdir', () => {
  it('rm root', async () => {
    await rmRecursive(tdir)
  })
  it('dir not exist', () => {
    expect(existsSync(tdir)).toBe(false)
  })
  it('mkdir root', async () => {
    await mkdirRecursive(tdir)
  })
  it('dir exist', () => {
    expect(existsSync(tdir)).toBe(true)
  })
  it('sub dir not exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(false)
  })
  it('mkdir sub', async () => {
    await mkdirRecursive(tdir + '1/1/1')
  })
  it('sub dir exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(true)
  })
  it('rm sub', async () => {
    await rmRecursive(tdir + '1/1/1')
  })
  it('sub dir not exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(false)
    expect(existsSync(tdir + '1/1')).toBe(true)
  })
  it('rm invalid dir', async () => {
    await rmRecursive(tdir + 'xxx')
  })
})

describe('rm/mkdir sync', () => {
  it('rm root', () => {
    rmRecursiveSync(tdir)
  })
  it('dir not exist', () => {
    expect(existsSync(tdir)).toBe(false)
  })
  it('mkdir root', () => {
    mkdirRecursiveSync(tdir)
  })
  it('dir exist', () => {
    expect(existsSync(tdir)).toBe(true)
  })
  it('sub dir not exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(false)
  })
  it('mkdir sub', () => {
    mkdirRecursiveSync(tdir + '1/1/1')
  })
  it('sub dir exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(true)
  })
  it('rm sub', () => {
    rmRecursiveSync(tdir + '1/1/1')
  })
  it('sub dir not exist', () => {
    expect(existsSync(tdir + '1/1/1')).toBe(false)
    expect(existsSync(tdir + '1/1')).toBe(true)
  })
  it('rm invalid dir', () => {
    rmRecursiveSync(tdir + 'xxx')
  })
})
