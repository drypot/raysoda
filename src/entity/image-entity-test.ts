import { imageOf } from './image-entity.js'

describe('Image Entity', () => {

  it('create', () => {
    const image = imageOf()
    expect(image).toEqual(jasmine.objectContaining({
      id: 0,
      uid: 0,
      vers: undefined,
      comment: ''
    }))
  })
  it('create 2', () => {
    const d = new Date()
    const image = imageOf({
      id: 10,
      uid: 100,
      cdate: d,
      comment: 'text1',
    })
    expect(image).toEqual(jasmine.objectContaining({
      id: 10,
      uid: 100,
      cdate: d,
      vers: undefined,
      comment: 'text1',
    }))
  })

})
