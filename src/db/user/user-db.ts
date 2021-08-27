import { DB } from '../_db/db.js'
import { User } from '../../entity/user-entity.js'
import { Config } from '../../config/config.js'

export interface UserListItem {
  id: number
  name: string
  home: string
}

export class UserDB {

  public readonly config: Config
  private readonly db: DB
  private nextUserId: number

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
    this.nextUserId = 0
  }

  static from(db: DB) {
    return new UserDB(db)
  }

  // Table

  async createTable(createIndex: boolean = true) {
    const q =
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
    await this.db.query(q)
    if (createIndex) {
      await this.db.createIndexIfNotExists(
        'create index user_email on user(email)'
      )
      await this.db.createIndexIfNotExists(
        'create index user_name on user(name)'
      )
      await this.db.createIndexIfNotExists(
        'create index user_home on user(home)'
      )
      await this.db.createIndexIfNotExists(
        'create index user_pdate on user(pdate desc)'
      )
    }
    this.nextUserId = await this.db.getMaxId('user')
    this.nextUserId++
    return this
  }

  async dropTable() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists user')
  }

  // ID

  getNextUserId() {
    return this.nextUserId++
  }

  setNextUserId(id: number) {
    this.nextUserId = id
  }

  // Query

  async insertUser(user: User) {
    return this.db.query('insert into user set ?', user)
  }

  async findUserById(id: number) {
    const r = await this.db.queryOne('select * from user where id = ?', id)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async findUserByEmail(email: string) {
    const r = await this.db.queryOne('select * from user where email = ?', email)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async findUserByHome(home: string) {
    const r = await this.db.queryOne('select * from user where home = ?', home)
    if (r) unpackUser(r)
    return r as User | undefined
  }

  async findUserList(offset: number = 0, ps: number = 100) {
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

  async nameIsDupe(id: number, name: string) {
    const r = await this.db.queryOne(
      'select exists(select * from user where name = ? and id != ?) as exist',
      [name, id]
    )
    return r.exist === 1
  }

  async homeIsDupe(id: number, home: string) {
    const r = await this.db.queryOne(
      'select exists(select * from user where home = ? and id != ?) as exist',
      [home, id]
    )
    return r.exist === 1

  }

  async emailIsDupe(id: number, email: string) {
    const r = await this.db.queryOne(
      'select exists(select * from user where email = ? and id != ?) as exist',
      [email, id]
    )
    return r.exist === 1
  }

  async updateUserADate(id: number, now: Date) {
    const r = await this.db.query('update user set adate = ? where id = ?', [now, id])
    return r.changedRows as number
  }

  async updateHash(email: string, hash: string) {
    const r = await this.db.query('update user set hash = ? where email = ?', [hash, email])
    return r.changedRows as number
  }

  async updateUser(id: number, update: Partial<User>) {
    const r = await this.db.query('update user set ? where id = ?', [update, id])
    return r.changedRows as number
  }

  async updateUserStatus(id: number, s: string) {
    const r = await this.db.query('update user set status = ? where id = ?', [s, id])
    return r.changedRows as number
  }

  async updateUserPDate(id: number, d: Date) {
    const r = await this.db.query('update user set pdate = ? where id = ?', [d, id])
    return r.changedRows as number
  }


  // Cache

  private userIdMap = new Map
  private userHomeMap = new Map

  resetCache() {
    this.userIdMap = new Map
    this.userHomeMap = new Map
  }

  cache(user: User) {
    this.userIdMap.set(user.id, user)
    this.userHomeMap.set(user.home.toLowerCase(), user)
  }

  deleteCacheById(id: number) {
    const user = this.userIdMap.get(id)
    if (user) {
      this.userIdMap.delete(id)
      this.userHomeMap.delete(user.home.toLowerCase())
    }
  }

  async getCachedById(id: number) {
    let user = this.userIdMap.get(id)
    if (user) {
      return user as User
    }
    user = await this.findUserById(id)
    if (user) this.cache(user)
    return user as User | undefined
  }

  getStrictlyCachedById(id: number) {
    return this.userIdMap.get(id) as User | undefined
  }

  async getCachedByHome(home: string) {
    let user = this.userHomeMap.get(home.toLowerCase())
    if (user) {
      return user as User
    }
    user = await this.findUserByHome(home)
    if (user) this.cache(user)
    return user as User | undefined
  }

  getStrictlyCachedByHome(home: string) {
    return this.userHomeMap.get(home.toLowerCase()) as User | undefined
  }

  async getRecachedByEmail(email: string) {
    const user = await this.findUserByEmail(email)
    if (user) {
      this.deleteCacheById(user.id)
      this.cache(user)
    }
    return user as User | undefined
  }

}

function unpackUser(user: User) {
  // admin 컬럼은 bool 타입이고, bool 은 실제로 tinyint(1) 다.
  // 저장할 때는 true, false 를 사용해도 되지만 읽을 때는 number 가 돌아온다.
  user.admin = user.admin as unknown === 1
}

function unpackUserList(users: User[]) {
  for (const user of users) {
    user.admin = user.admin as unknown === 1
  }
}
