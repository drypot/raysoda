import { Config, configFrom } from '../config/config.js'
import { ImageFileManager } from './fileman.js'
import { FormError } from '../lib/base/error2.js'
import { IMAGE_TYPE } from '../service/image/form/image-form.js'
import { existsSync } from 'fs'
import { imageMetaOf } from '../entity/image-meta.js'
import { DrypotFileManager } from './drypot-fileman.js'

describe('DrypotFileManager', () => {

  let config: Config
  let fm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/drypot-test.json')
    fm = DrypotFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(fm.dir).toBe('upload/drypot-test/public/images/')
      expect(fm.url).toBe('http://file.drypot.test:8080/images/')
    })
    it('get dir', () => {
      expect(fm.getDirFor(1)).toBe(fm.dir + '0/0')
      expect(fm.getDirFor(1_234_567)).toBe(fm.dir + '1/234')
    })
    it('get path', () => {
      expect(fm.getPathFor(1)).toBe(fm.dir + '0/0/1.svg')
      expect(fm.getPathFor(1_234_567)).toBe(fm.dir + '1/234/1234567.svg')
    })
    it('get dir rul', () => {
      expect(fm.getDirUrlFor(1)).toBe(fm.url + '0/0')
      expect(fm.getDirUrlFor(1_234_567)).toBe(fm.url + '1/234')
    })
    it('get thumb url', () => {
      expect(fm.getThumbUrlFor(1)).toBe(fm.url + '0/0/1.svg')
      expect(fm.getThumbUrlFor(1_234_567)).toBe(fm.url + '1/234/1234567.svg')
    })
  })

  describe('check meta', () => {
    it('if jpeg', () => {
      const meta = imageMetaOf({ format: 'jpeg' })
      const errs: FormError[] = []
      fm.checkMeta(meta, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(IMAGE_TYPE)
    })
    it('if svg', () => {
      const meta = imageMetaOf({ format: 'svg' })
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
    it('save small image', async () => {
      await fm.saveImage(1, 'sample/svg-sample.svg')
    })
    it('file exists', () => {
      expect(existsSync(fm.getPathFor(1))).toBe(true)
    })
    it('delete image', async () => {
      await fm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(fm.getPathFor(1))).toBe(false)
    })
  })
})
