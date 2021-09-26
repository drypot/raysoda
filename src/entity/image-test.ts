import { imageOf } from './image.js'
import { dateNull } from '../lib/base/date2.js'

describe('Image', () => {

  it('create', () => {
    const image = imageOf()
    expect(image).toEqual(jasmine.objectContaining({
      id: 0,
      uid: 0,
      cdate: dateNull,
      vers: null,
      comment: ''
    }))
  })
  it('create 2', () => {
    const image = imageOf({
      id: 10,
      uid: 100,
      cdate: dateNull,
      vers: [10, 20, 30],
      comment: 'text1',
    })
    expect(image).toEqual(jasmine.objectContaining({
      id: 10,
      uid: 100,
      cdate: dateNull,
      vers: [10, 20, 30],
      comment: 'text1',
    }))
  })

})
