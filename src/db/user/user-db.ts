import { User } from '../../common/type/user.js'
import { UserListItem } from '../../common/type/user-detail.js'
import { getObject, registerObjectFactory } from '../../oman/oman.js'
import { UserCache } from './user-cache.js'
import { DB, getDatabase } from '../db/db.js'
import { inProduction } from '../../common/util/env2.js'

registerObjectFactory('UserDB', async () => {
  const udb = UserDB.from(await getDatabase())
  await udb.createTable()
  return udb
})

export async function getUserDB() {
  return await getObject('UserDB') as UserDB
}

export class UserDB {

  private db: DB
  private cache: UserCache
  private nextId: number

  static from(db: DB) {
    return new UserDB(db)
  }

  private constructor(db: DB) {
    this.db = db
    this.cache = new UserCache()
    this.nextId = 0
  }

  // Table

  async createTable() {
    await this.db.query(
      'create table if not exists user(' +
      '  id int not null,' +
      '  name varchar(32) not null,' +
      '  home varchar(32) not null,' +
      '  email varchar(64) not null,' +
      '  hash char(60) character set latin1 collate latin1_bin not null,' +
      '  status char(1) not null,' +
      '  admin bool not null,' +
      '  cdate datetime(3) not null,' +
      '  adate datetime(3) not null,' +
      '  pdate datetime(3) not null,' +
      '  profile text not null,' +
      '  primary key (id)' +
      ')'
    )
    await this.db.createIndexIfNotExists(
      'create unique index user_email on user(email)'
    )
    await this.db.createIndexIfNotExists(
      'create unique index user_name on user(name)'
    )
    await this.db.createIndexIfNotExists(
      'create unique index user_home on user(home)'
    )
    await this.db.createIndexIfNotExists(
      'create index user_pdate on user(pdate desc)'
    )
    this.nextId = await this.db.getMaxId('user')
    this.nextId++
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists user')
  }

  // Query

  async insertUser(user: User) {
    return this.db.query('insert into user set ?', user)
  }

  async updateUserById(id: number, user: Partial<User>) {
    const r = await this.db.update('update user set ? where id = ?', [user, id])
    this.cache.deleteCacheById(id)
    return r.affectedRows
  }

  async updateUserByEmail(email: string, user: Partial<User>) {
    const r = await this.db.update('update user set ? where email = ?', [user, email])
    await this.forceCachedByEmail(email)
    return r.affectedRows
  }

  resetCache() {
    this.cache.resetCache()
  }

  async getCachedById(id: number) {
    let user = this.cache.getCachedById(id)
    if (user) {
      return user
    }
    user = await this.getUserById(id)
    if (user) {
      this.cache.cacheUser(user)
    }
    return user
  }

  async getCachedByHome(home: string) {
    let user = this.cache.getCachedByHome(home)
    if (user) {
      return user
    }
    user = await this.getUserByHome(home)
    if (user) {
      this.cache.cacheUser(user)
    }
    return user
  }

  async forceCachedByEmail(email: string) {
    const user = await this.getUserByEmail(email)
    if (user) {
      this.cache.cacheUser(user)
    }
    return user
  }

  getCachedByIdStrict(id: number) {
    return this.cache.getCachedById(id)
  }

  getCachedByHomeStrict(home: string) {
    return this.cache.getCachedByHome(home)
  }

  async getUserById(id: number) {
    const r = await this.db.queryOne('select * from user where id = ?', id)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async getUserByEmail(email: string) {
    const r = await this.db.queryOne('select * from user where email = ?', email)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async getUserByName(name: string) {
    const r = await this.db.queryOne('select * from user where name = ?', name)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async getUserByHome(home: string) {
    const r = await this.db.queryOne('select * from user where home = ?', home)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async getUserList(offset: number = 0, ps: number = 100) {
    const r = await this.db.query(
      'select id, name, home from user order by pdate desc limit ?, ?',
      [offset, ps]
    )
    return r as UserListItem[]
  }

  async searchUser(q: string, offset: number = 0, ps: number = 100, admin: boolean = false) {
    let sql: string
    let param: any[]
    if (admin) {
      sql = 'select id, name, home from user where name = ? or home = ? or email = ? limit ?, ?'
      param = [q, q, q, offset, ps]
    } else {
      sql = 'select id, name, home from user where name = ? or home = ? limit ?, ?'
      param = [q, q, offset, ps]
    }
    const r = await this.db.query(sql, param)
    return r as UserListItem[]
  }

  // ID

  setNextId(id: number) {
    this.nextId = id
  }

  getNextId() {
    return this.nextId++
  }

}

function unpackUserList(users: User[]) {
  for (const user of users) {
    user.admin = user.admin as unknown === 1
  }
}

function unpackUser(user: User) {
  // admin 컬럼은 bool 타입이고, bool 은 실제로 tinyint(1) 다.
  // 저장할 때는 true, false 를 사용해도 되지만 읽을 때는 number 가 돌아온다.
  user.admin = user.admin as unknown === 1
}
