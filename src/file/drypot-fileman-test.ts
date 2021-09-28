import { Config, configFrom } from '../_config/config.js'
import { ImageFileManager } from './fileman.js'
import { Error2 } from '../_error/error2.js'
import { existsSync } from 'fs'
import { DrypotFileManager } from './drypot-fileman.js'
import { IMAGE_TYPE } from '../_error/error-image.js'
import { imageMetaOf } from '../core/image-meta.js'

describe('DrypotFileManager', () => {

  let config: Config
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = configFrom('config/drypot-test.json')
    ifm = DrypotFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(ifm.dir).toBe('upload/drypot-test/public/images/')
      expect(ifm.url).toBe('http://file.drypot.test:8080/images/')
    })
    it('get dir', () => {
      expect(ifm.getDirFor(1)).toBe(ifm.dir + '0/0')
      expect(ifm.getDirFor(1_234_567)).toBe(ifm.dir + '1/234')
    })
    it('get path', () => {
      expect(ifm.getPathFor(1)).toBe(ifm.dir + '0/0/1.svg')
      expect(ifm.getPathFor(1_234_567)).toBe(ifm.dir + '1/234/1234567.svg')
    })
    it('get dir rul', () => {
      expect(ifm.getDirUrlFor(1)).toBe(ifm.url + '0/0')
      expect(ifm.getDirUrlFor(1_234_567)).toBe(ifm.url + '1/234')
    })
    it('get thumb url', () => {
      expect(ifm.getThumbUrlFor(1)).toBe(ifm.url + '0/0/1.svg')
      expect(ifm.getThumbUrlFor(1_234_567)).toBe(ifm.url + '1/234/1234567.svg')
    })
  })

  describe('check meta', () => {
    it('if jpeg', () => {
      const meta = imageMetaOf({ format: 'jpeg' })
      const err: Error2[] = []
      ifm.checkMeta(meta, err)
      expect(err).toContain(IMAGE_TYPE)
    })
    it('if svg', () => {
      const meta = imageMetaOf({ format: 'svg' })
      const err: Error2[] = []
      ifm.checkMeta(meta, err)
      expect(err.length).toBe(0)
    })
  })

  describe('save file', () => {
    it('init root dir', async () => {
      await ifm.rmRoot()
    })
    it('file not exist', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
    it('save small image', async () => {
      const meta = await ifm.identify('sample/svg-sample.svg')
      await ifm.saveImage(1, 'sample/svg-sample.svg', meta)
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('delete image', async () => {
      await ifm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
  })
})
