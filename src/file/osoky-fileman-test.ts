import { Config, configFrom } from '../config/config.js'
import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { IMAGE_SIZE } from '../service/image/form/image-form.js'
import { identify } from './magick/magick2.js'
import { existsSync } from 'fs'
import { imageMetaOf } from '../entity/image-meta.js'
import { OsokyFileManager } from './osoky-fileman.js'

describe('OsokyFileManager', () => {

  let config: Config
  let fm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/osoky-test.json')
    fm = OsokyFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(fm.dir).toBe('upload/osoky-test/public/images/')
      expect(fm.url).toBe('http://file.osoky.test:8080/images/')
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
    it('if size too small', () => {
      const meta = imageMetaOf({ width: 639, height: 639, shorter: 639 })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_SIZE)
    })
    it('if size valid', () => {
      const meta = imageMetaOf({ width: 640, height: 640, shorter: 640 })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(0)
    })
  })

  describe('save file', () => {
    it('init root dir', async () => {
      await fm.rmRoot()
    })
    it('file not exist', () => {
      expect(existsSync(fm.getPathFor(1))).toBe(false)
    })
    it('save image', async () => {
      const meta = await identify('sample/4096x2304.jpg')
      await fm.saveImage(1, 'sample/4096x2304.jpg', meta)
    })
    it('file exists', () => {
      expect(existsSync(fm.getPathFor(1))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await identify(fm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(2048)
    })
    it('delete image', async () => {
      await fm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(fm.getPathFor(1))).toBe(false)
    })
  })
})
