import { OsokyFileManager } from '@server/fileman/osoky-fileman'
import { ErrorConst } from '@common/type/error'
import { existsSync } from 'fs'
import { IMAGE_SIZE } from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { newImageMeta } from '@common/type/image-meta'
import { getImageMetaOfFile } from '@server/fileman/magick/magick2'
import { ImageFileManager } from '@server/fileman/_fileman'

describe('OsokyFileManager', () => {

  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/osoky-test.json')
    ifm = await omanGetObject('OsokyFileManager') as OsokyFileManager
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  describe('path', () => {
    it('root dir', () => {
      expect(ifm.dir).toBe('upload/osoky-test/public/images/')
      expect(ifm.url).toBe('http://file.osoky.test:8080/images/')
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
    it('if size too small', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 639, height: 639, shorter: 639 })
      const err: ErrorConst[] = []
      ifm.checkMeta(meta, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('if size valid', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 640, height: 640, shorter: 640 })
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
    it('save image', async () => {
      const meta = await getImageMetaOfFile('sample/4096x2304.jpg')
      await ifm.saveImage(1, 'sample/4096x2304.jpg', meta)
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await getImageMetaOfFile(ifm.getPathFor(1))
      expect(meta.width).toBe(2048)
      expect(meta.height).toBe(2048)
    })
    it('delete image', async () => {
      await ifm.deleteImage(1)
    })
    it('file not exist', () => {
      expect(existsSync(ifm.getPathFor(1))).toBe(false)
    })
  })

})
