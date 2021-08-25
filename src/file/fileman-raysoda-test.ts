import { Config, configFrom } from '../config/config.js'
import { ImageFileManager } from './fileman.js'
import { RaySodaFileManager } from './fileman-raysoda.js'
import { FormError } from '../lib/base/error2.js'
import { IMAGE_SIZE } from '../service/image/form/image-form.js'
import { identify, imageMetaOf } from './magick2.js'
import { existsSync } from 'fs'

describe('RaySodaFileManager', () => {

  let config: Config
  let fm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    fm = RaySodaFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(fm.dir).toBe('upload/raysoda-test/public/images/')
      expect(fm.url).toBe('http://file.raysoda.test:8080/images/')
    })
    it('get dir', () => {
      expect(fm.getDirFor(1)).toBe(fm.dir + '0/0')
      expect(fm.getDirFor(1_234_567)).toBe(fm.dir + '1/234')
    })
    it('get path', () => {
      expect(fm.getPathFor(1)).toBe(fm.dir + '0/0/1.jpg')
      expect(fm.getPathFor(1_234_567)).toBe(fm.dir + '1/234/1234567.jpg')
    })
    it('get dir rul', () => {
      expect(fm.getDirUrlFor(1)).toBe(fm.url + '0/0')
      expect(fm.getDirUrlFor(1_234_567)).toBe(fm.url + '1/234')
    })
    it('get thumb url', () => {
      expect(fm.getThumbUrlFor(1)).toBe(fm.url + '0/0/1.jpg')
      expect(fm.getThumbUrlFor(1_234_567)).toBe(fm.url + '1/234/1234567.jpg')
    })
  })

  describe('check meta', () => {
    it('size too small', () => {
      const meta = imageMetaOf({ width: 239, height: 239 })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_SIZE)
    })
    it('size valid', () => {
      const meta = imageMetaOf({ width: 240, height: 240 })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('image file', () => {
    let path1 = 'xxx'
    it('init root dir', () => {
      fm.rmRootSync()
      path1 = fm.getPathFor(1)
    })
    it('file not exist', () => {
      expect(existsSync(path1)).toBe(false)
    })
    it('save small image', async () => {
      await fm.saveImage(1, 'sample/360x240.jpg')
    })
    it('file exists', () => {
      expect(existsSync(path1)).toBe(true)
    })
    it('check meta', async () => {
      const meta = await identify(path1)
      expect(meta.width).toBe(360)
      expect(meta.height).toBe(240)
    })
    it('save large image', async () => {
      await fm.saveImage(1, 'sample/2560x1440.jpg')
    })
    it('file exists', () => {
      expect(existsSync(path1)).toBe(true)
    })
    it('check meta', async () => {
      const meta = await identify(path1)
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('delete image', async () => {
      fm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(path1)).toBe(false)
    })
  })
})
