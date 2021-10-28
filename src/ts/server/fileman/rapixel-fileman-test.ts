import { ErrorConst } from '@common/type/error'
import { existsSync } from 'fs'
import { IMAGE_SIZE } from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { RapixelFileManager } from '@server/fileman/rapixel-fileman'
import { newImageMeta } from '@common/type/image-meta'
import { getImageMetaOfFile } from '@server/fileman/magick/magick2'
import { ImageFileManager } from '@server/fileman/_fileman'

describe('RapixelFileManager', () => {

  let ifm: ImageFileManager

  beforeAll(async () => {
    omanNewSession('config/rapixel-test.json')
    ifm = await omanGetObject('RapixelFileManager') as RapixelFileManager
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  describe('path', () => {
    it('root dir', () => {
      expect(ifm.dir).toBe('upload/rapixel-test/public/images/')
      expect(ifm.url).toBe('http://file.rapixel.test:8080/images/')
    })
    it('get dir', () => {
      expect(ifm.getDirFor(1)).toBe(ifm.dir + '0/0/1')
      expect(ifm.getDirFor(1_234_567)).toBe(ifm.dir + '1/234/567')
    })
    it('get path', () => {
      expect(ifm.getPathFor(1, 2560)).toBe(ifm.dir + '0/0/1/1-2560.jpg')
      expect(ifm.getPathFor(1_234_567, 2560)).toBe(ifm.dir + '1/234/567/1234567-2560.jpg')
    })
    it('get dir rul', () => {
      expect(ifm.getDirUrlFor(1)).toBe(ifm.url + '0/0/1')
      expect(ifm.getDirUrlFor(1_234_567)).toBe(ifm.url + '1/234/567')
    })
    it('get thumb url', () => {
      expect(ifm.getThumbUrlFor(1)).toBe(ifm.url + '0/0/1/1-2560.jpg')
      expect(ifm.getThumbUrlFor(1_234_567)).toBe(ifm.url + '1/234/567/1234567-2560.jpg')
    })
  })

  describe('check meta', () => {
    it('if size too small', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 2560, height: 1440 })
      const err: ErrorConst[] = []
      ifm.checkMeta(meta, err)
      expect(err).toContain(IMAGE_SIZE)
    })
    it('if size valid', () => {
      const meta = newImageMeta({ format: 'jpeg', width: 3840, height: 2160 })
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
      expect(existsSync(ifm.getPathFor(1, 2560))).toBe(false)
    })
    it('save 5120 image', async () => {
      const meta = await getImageMetaOfFile('sample/5120x2880.jpg')
      const vers = await ifm.saveImage(1, 'sample/5120x2880.jpg', meta)
      expect(vers).toEqual([5120, 4096, 2560, 1280])
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(1, 1280))).toBe(true)
      expect(existsSync(ifm.getPathFor(1, 2560))).toBe(true)
      expect(existsSync(ifm.getPathFor(1, 4096))).toBe(true)
      expect(existsSync(ifm.getPathFor(1, 5120))).toBe(true)
    })
    it('check meta', async () => {
      const meta = await getImageMetaOfFile(ifm.getPathFor(1, 2560))
      expect(meta.width).toBe(2560)
      expect(meta.height).toBe(1440)
    })
    it('save 4096 image', async () => {
      const meta = await getImageMetaOfFile('sample/4096x2304.jpg')
      const vers = await ifm.saveImage(2, 'sample/4096x2304.jpg', meta)
      expect(vers).toEqual([4096, 2560, 1280])
    })
    it('file exists', () => {
      expect(existsSync(ifm.getPathFor(2, 1280))).toBe(true)
      expect(existsSync(ifm.getPathFor(2, 2560))).toBe(true)
      expect(existsSync(ifm.getPathFor(2, 4096))).toBe(true)
      expect(existsSync(ifm.getPathFor(2, 5120))).toBe(false)
    })
    it('delete image', async () => {
      await ifm.deleteImage(2)
    })
    it('file not exist', () => {
      expect(existsSync(ifm.getPathFor(2, 2560))).toBe(false)
    })
  })

})
