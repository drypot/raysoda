import { Config, configFrom } from '../../config/config.js'
import { DB } from '../_db/db.js'
import { ImageDB } from './image-db.js'
import { imageOf } from '../../entity/image-entity.js'
import { dupeOf } from '../../lib/base/object2.js'

describe('ImageDB', () => {

  let config: Config
  let db: DB
  let idb: ImageDB

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    idb = ImageDB.from(db)
  })

  afterAll(async () => {
    await db.close()
  })

  describe('image', () => {
    const d = new Date()
    it('init table', async () => {
      await idb.dropTable()
      await idb.createTable(false)
    })
    it('find image returns nothing', async () => {
      const image = await idb.findImage(10)
      expect(image).toBeUndefined()
    })
    it('insert image', async () => {
      const image = imageOf({ cdate: d })
      await idb.insertImage(image)
    })
    it('find image', async () => {
      const image = await idb.findImage(0)
      expect(dupeOf(image)).toEqual({
        id: 0, uid: 0, cdate: d, vers: null, comment: ''
      })
    })
    it('insert image', async () => {
      const image = imageOf({
        id: 10, uid: 100, cdate: d, vers: [{ width: 1280, height: 720 }], comment: 'text1'
      })
      await idb.insertImage(image)
    })
    it('find image', async () => {
      const image = await idb.findImage(10)
      expect(dupeOf(image)).toEqual({
        id: 10, uid: 100, cdate: d, vers: [{ width: 1280, height: 720 }], comment: 'text1'
      })
    })
    it('update image', async () => {
      await idb.updateImage(10, { comment: 'text2' })
    })
    it('find image', async () => {
      const image = await idb.findImage(10)
      expect(dupeOf(image)).toEqual({
        id: 10, uid: 100, cdate: d, vers: [{ width: 1280, height: 720 }], comment: 'text2'
      })
    })
    it('update image 2', async () => {
      await idb.updateImage(10, { vers: [{ width: 5120, height: 2880}] })
    })
    it('find image', async () => {
      const image = await idb.findImage(10)
      expect(dupeOf(image)).toEqual({
        id: 10, uid: 100, cdate: d, vers: [{ width: 5120, height: 2880}], comment: 'text2'
      })
    })
    it('delete image', async () => {
      await idb.deleteImage(10)
    })
    it('find image', async () => {
      const image = await idb.findImage(10)
      expect(image).toBeUndefined()
    })
  })

})
