import { ImageDB } from './image-db'
import { newImage } from '../../_type/image'
import { dupe } from '../../_util/object2'
import { dateNull } from '../../_util/date2'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../oman/oman'

describe('ImageDB.*Image', () => {

  let idb: ImageDB

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    idb = await omanGetObject('ImageDB') as ImageDB
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('find image returns nothing', async () => {
    const image = await idb.findImage(10)
    expect(image).toBeUndefined()
  })
  it('insert image 1', async () => {
    const image = newImage({ id: 1 })
    await idb.insertImage(image)
  })
  it('find image 1', async () => {
    const image = await idb.findImage(1)
    expect(dupe(image)).toEqual({
      id: 1, uid: 0, cdate: dateNull, vers: null, comment: ''
    })
  })
  it('insert image 10', async () => {
    const image = newImage({
      id: 10, uid: 100, cdate: dateNull, vers: [5120, 4096], comment: 'text1'
    })
    await idb.insertImage(image)
  })
  it('find image 10', async () => {
    const image = await idb.findImage(10)
    expect(dupe(image)).toEqual({
      id: 10, uid: 100, cdate: dateNull, vers: [5120, 4096], comment: 'text1'
    })
  })
  it('update image 10 comment', async () => {
    await idb.updateImage(10, { comment: 'text2' })
  })
  it('find image 10 comment', async () => {
    const image = await idb.findImage(10)
    expect(dupe(image)).toEqual({
      id: 10, uid: 100, cdate: dateNull, vers: [5120, 4096], comment: 'text2'
    })
  })
  it('update image 10 vers', async () => {
    await idb.updateImage(10, { vers: [4096] })
  })
  it('find image 10 vers', async () => {
    const image = await idb.findImage(10)
    expect(dupe(image)).toEqual({
      id: 10, uid: 100, cdate: dateNull, vers: [4096], comment: 'text2'
    })
  })
  it('delete image', async () => {
    await idb.deleteImage(10)
  })
  it('find deleted', async () => {
    const image = await idb.findImage(10)
    expect(image).toBeUndefined()
  })

})
