import { existsSync } from 'fs'
import { emptyDir, mkdirRecursive, rmRecursive } from './fs2.js'
import { writeFile } from 'fs/promises'

describe('fs2', () => {

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
    it('dir not exist', () => {
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
})

