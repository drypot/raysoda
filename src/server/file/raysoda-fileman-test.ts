import { loadConfigSync } from '../_util/config-loader'
import { ImageFileManager } from './fileman'
import { RaySodaFileManager } from './raysoda-fileman'
import { getImageMetaOfFile } from './magick/magick2'
import { existsSync } from 'fs'
import { IMAGE_SIZE } from '../_type/error-image'
import { newImageMeta } from '../_type/image-meta'
import { Config } from '../_type/config'
import { ErrorConst } from '../_type/error'

describe('RaySodaFileManager', () => {

  let config: Config
  let ifm: ImageFileManager

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')
    ifm = RaySodaFileManager.from(config)
  })

  describe('path', () => {
    it('root dir', () => {
      expect(ifm.dir).toBe('upload/raysoda-test/public/images/')
      expect(ifm.url).toBe('http://file.raysoda.test:8080/images/')
    })
    it('get dir', () => {
      expect(ifm.getDirFor(1)).toBe(ifm.dir + '0/0')
      expect(ifm.getDirFor(1_234_567)).toBe(ifm.dir + '1/234')
    })
    it('get path', () => {
      expect(ifm.getPathFor(1)).toBe(ifm.dir + '0/0/1.jpg')
      expect(ifm.getPathFor(1_234_567)).toBe(ifm.dir + '1/234/1234567.jpg')
    })
    it('get dir rul', () => {
      expect(ifm.getDirUrlFor(1)).toBe(ifm.url + '0/0')
      expect(ifm.getDirUrlFor(1_234_567)).toBe(ifm.url + '1/234')
    })
    it('get thumb url', () => {
      expect(ifm.getThumbUrlFor(1)).toBe(ifm.url + '0/0/1.jpg')
      expect(ifm.getThumbUrlFor(1_234_567)).toBe(ifm.url + '1/234/1234567.jpg')
    })
  })

  describe('check meta', () => {
    it('err if size too small', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 240, height: 240 })
      const err: ErrorConst[] = []
      ifm.checkMeta(meta, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('ok if size valid', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 241, height: 241 })
      const err: ErrorConst[] = []
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
    // saveImage 안에서는 checkMeta 를 하지 않는다.
    // 저장하려하면 저장된다.
    it('save small image', async () => {
      const meta = await ifm.getImageMeta('sample/360x240.jpg')
      await ifm.saveImage(1, 'sample/360x240.jpg', meta)
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await getImageMetaOfFile(ifm.getPathFor(1))
      expect(meta.width).toBe(360)
      expect(meta.height).toBe(240)
    })
    it('save large image', async () => {
      const meta = await ifm.getImageMeta('sample/2560x1440.jpg')
      await ifm.saveImage(1, 'sample/2560x1440.jpg', meta)
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await getImageMetaOfFile(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(1152)
    })
    it('delete image', async () => {
      await ifm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
  })

})
