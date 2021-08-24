import { User, userOf } from './user-entity.js'

describe('User Entity', () => {

  describe('User', () => {
    it('check create user', () => {
      const user = userOf()
      expect(user).toBeDefined()
      expect(user.id).toBe(0)
      expect(user.name).toBe('')
      expect(user.email).toBe('')
      expect(user.status).toBe('v')
    })
    it('check create user 2', () => {
      const _user: Partial<User> = {
        id: 10,
        name: 'User 1',
        email: 'user1@mail.test',
      }
      const user = userOf(_user)
      expect(user).toBeDefined()
      expect(user.id).toBe(10)
      expect(user.name).toBe('User 1')
      expect(user.email).toBe('user1@mail.test')
      expect(user.status).toBe('v')
    })
  })

})
