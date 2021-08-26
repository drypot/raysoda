import { Config, configFrom } from '../config/config.js'
import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { IMAGE_SIZE } from '../service/image/form/image-form.js'
import { identify } from './magick/magick2.js'
import { existsSync } from 'fs'
import { imageMetaOf } from '../entity/image-meta.js'
import { RapixelFileManager } from './rapixel-fileman.js'

describe('RapixelFileManager', () => {

  let config: Config
  let fm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/rapixel-test.json')
    fm = RapixelFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(fm.dir).toBe('upload/rapixel-test/public/images/')
      expect(fm.url).toBe('http://file.rapixel.test:8080/images/')
    })
    it('get dir', () => {
      expect(fm.getDirFor(1)).toBe(fm.dir + '0/0/1')
      expect(fm.getDirFor(1_234_567)).toBe(fm.dir + '1/234/567')
    })
    it('get path', () => {
      expect(fm.getPathFor(1, 2560)).toBe(fm.dir + '0/0/1/1-2560.jpg')
      expect(fm.getPathFor(1_234_567, 2560)).toBe(fm.dir + '1/234/567/1234567-2560.jpg')
    })
    it('get dir rul', () => {
      expect(fm.getDirUrlFor(1)).toBe(fm.url + '0/0/1')
      expect(fm.getDirUrlFor(1_234_567)).toBe(fm.url + '1/234/567')
    })
    it('get thumb url', () => {
      expect(fm.getThumbUrlFor(1)).toBe(fm.url + '0/0/1/1-2560.jpg')
      expect(fm.getThumbUrlFor(1_234_567)).toBe(fm.url + '1/234/567/1234567-2560.jpg')
    })
  })

  describe('check meta', () => {
    it('if size too small', () => {
      const meta = imageMetaOf({ width: 2560, height: 1440 })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_SIZE)
    })
    it('if size valid', () => {
      const meta = imageMetaOf({ width: 3840, height: 2160 })
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
      expect(existsSync(fm.getPathFor(1, 2560))).toBe(false)
    })
    it('save 5120 image', async () => {
      const meta = await identify('sample/5120x2880.jpg')
      const vers = await fm.saveImage(1, 'sample/5120x2880.jpg', meta)
      expect(vers).toEqual([5120, 4096, 2560, 1280])
    })
    it('file exists', () => {
      expect(existsSync(fm.getPathFor(1, 1280))).toBe(true)
      expect(existsSync(fm.getPathFor(1, 2560))).toBe(true)
      expect(existsSync(fm.getPathFor(1, 4096))).toBe(true)
      expect(existsSync(fm.getPathFor(1, 5120))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await identify(fm.getPathFor(1, 2560))
      expect(meta.width).toBe(2560)
      expect(meta.height).toBe(1440)
    })
    it('save 4096 image', async () => {
      const meta = await identify('sample/4096x2304.jpg')
      const vers = await fm.saveImage(2, 'sample/4096x2304.jpg', meta)
      expect(vers).toEqual([4096, 2560, 1280])
    })
    it('file exists', () => {
      expect(existsSync(fm.getPathFor(2, 1280))).toBe(true)
      expect(existsSync(fm.getPathFor(2, 2560))).toBe(true)
      expect(existsSync(fm.getPathFor(2, 4096))).toBe(true)
      expect(existsSync(fm.getPathFor(2, 5120))).toBe(false)
    })
    it('delete image', async () => {
      await fm.deleteImage(2)
    })
    it('file not exist', () => {
      expect(existsSync(fm.getPathFor(2, 2560))).toBe(false)
    })
  })

})
