import { UserDB } from '../../db/user/user-db.js'
import { User } from '../../_type/user.js'

export async function userDetailService(udb: UserDB, id: number, priv: boolean) {
  const user1 = await udb.getCachedById(id)
  if (!user1) return undefined
  const user2: Partial<User> = {
    id: user1.id,
    name: user1.name,
    home: user1.home,
    //email: user1.email,
    status: user1.status,
    cdate: user1.cdate,
    //adate: user1.adate,
    pdate: user1.pdate,
    profile: user1.profile
  }
  if (priv) {
    user2.email = user1.email
    user2.adate = user1.adate
  }
  return user2
}
