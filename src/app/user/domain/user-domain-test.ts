import { newUser, User } from './user-domain.js'

describe('User', () => {
  it('can be created', () => {
    const user = newUser()
    expect(user).toBeDefined()
    expect(user.id).toBe(0)
    expect(user.status).toBe('v')
  })
})
