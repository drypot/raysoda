import { existsSync, writeFileSync } from 'fs'
import { emptyDirSync, mkdirRecursiveSync, rmRecursiveSync } from './fs2.js'

describe('fs2', () => {

  const tdir = 'tmp/fs/'

  describe('rm/mkdir', () => {
    it('rm root', () => {
      rmRecursiveSync(tdir)
    })
    it('dir not exist', () => {
      expect(existsSync(tdir)).toBe(false)
    })
    it('mkdir root', () => {
      mkdirRecursiveSync(tdir)
    })
    it('dir not exist', () => {
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

  describe('empty dir', () => {
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
      emptyDirSync(tdir + 'xxx')
    })
  })
})

