import { userOf } from './user-entity.js'

describe('User Entity', () => {

  it('create', () => {
    const user = userOf()
    expect(user).toEqual(jasmine.objectContaining({
      id: 0,
      name: '',
      email: '',
      status: 'v',
    }))
  })
  it('create 2', () => {
    const user = userOf({
      id: 10,
      name: 'User 1',
      email: 'user1@mail.test',
    })
    expect(user).toEqual(jasmine.objectContaining({
      id: 10,
      name: 'User 1',
      email: 'user1@mail.test',
      status: 'v',
    }))
  })

})
