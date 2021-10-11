import { existsSync, writeFileSync } from 'fs'
import { emptyDir, emptyDirSync, mkdirRecursive, mkdirRecursiveSync, rmRecursive, rmRecursiveSync } from './fs2'
import { writeFile } from 'fs/promises'

// exists 는 deprecated 되었지만 existsSync 는 계속 유효하다.
// exists 대신 access 가 권장되기도 하는데
// 아래처럼 해야해서 번잡하다.
// await expectAsync(access(tdir)).toBeRejected()

const tdir = 'tmp/fs/'

describe('empty dir', () => {
  it('init files', async () => {
    await rmRecursive(tdir)
    await mkdirRecursive(tdir + '1/2')
    await writeFile(tdir + '0.txt', 'abc')
    await writeFile(tdir + '1/11.txt', 'abc')
    await writeFile(tdir + '1/12.txt', 'abc')
    await writeFile(tdir + '1/2/2.txt', 'abc')
  })
  it('empty dir 1', async () => {
    await emptyDir(tdir + '1')
  })
  it('check', () => {
    expect(existsSync(tdir + '0.txt')).toBe(true)
    expect(existsSync(tdir + '1/11.txt')).toBe(false)
    expect(existsSync(tdir + '1/12.txt')).toBe(false)
    expect(existsSync(tdir + '1/2/2.txt')).toBe(true)
  })
  it('empty invalid dir', async () => {
    await expectAsync(emptyDir(tdir + 'xxx')).toBeRejected()
  })
})

describe('empty dir sync', () => {
  it('init files', () => {
    rmRecursiveSync(tdir)
    mkdirRecursiveSync(tdir + '1/2')
    writeFileSync(tdir + '0.txt', 'abc')
    writeFileSync(tdir + '1/11.txt', 'abc')
    writeFileSync(tdir + '1/12.txt', 'abc')
    writeFileSync(tdir + '1/2/2.txt', 'abc')
  })
  it('empty dir 1', () => {
    emptyDirSync(tdir + '1')
  })
  it('check', () => {
    expect(existsSync(tdir + '0.txt')).toBe(true)
    expect(existsSync(tdir + '1/11.txt')).toBe(false)
    expect(existsSync(tdir + '1/12.txt')).toBe(false)
    expect(existsSync(tdir + '1/2/2.txt')).toBe(true)
  })
  it('empty invalid dir', () => {
    expect(() => {
      emptyDirSync(tdir + 'xxx')
    }).toThrow()
  })
})

