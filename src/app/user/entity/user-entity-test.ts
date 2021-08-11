import { newUser, User } from './user-entity.js'

describe('User', () => {

  it('can be created', () => {
    const user = newUser()
    expect(user).toBeDefined()
    expect(user.id).toBe(0)
    expect(user.name).toBe('')
    expect(user.email).toBe('')
    expect(user.status).toBe('v')
  })
  it('can be created 2', () => {
    const _user = {
      id: 10,
      name: 'Alice Liddell',
      email: 'alice@mail.test'
    }
    const user = newUser(_user)
    expect(user).toBeDefined()
    expect(user.id).toBe(10)
    expect(user.name).toBe('Alice Liddell')
    expect(user.email).toBe('alice@mail.test')
    expect(user.status).toBe('v')
  })

})
