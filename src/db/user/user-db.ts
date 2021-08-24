import { DB } from '../_db/db.js'
import { User } from '../../service/user/entity/user-entity.js'
import { Config } from '../../config/config.js'

export const MSG_USER_NOT_FOUND = 'User not found'

export interface UserListItem {
  id: number
  name: string
  home: string
}

export class UserDB {

  public config: Config
  private db: DB
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
      throw (new Error('can not drop in production mode.'))
    }
    await this.db.query('drop table if exists user')
  }

  // Next User ID

  getNextUserId() {
    return this.nextUserId++
  }

  setNextUserId(nextId: number) {
    this.nextUserId = nextId
  }

  // Query

  async insertUser(user: User) {
    return this.db.query('insert into user set ?', user)
  }

  async findUserById(id: number): Promise<User | undefined> {
    const r = await this.db.query('select * from user where id = ?', id)
    const user = r[0]
    if (user) unpackUser(user)
    return user
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const r = await this.db.query('select * from user where email = ?', email)
    const user = r[0]
    if (user) unpackUser(user)
    return user
  }

  async findUserByHome(home: string): Promise<User | undefined> {
    const r = await this.db.query('select * from user where home = ?', home)
    const user = r[0]
    if (user) unpackUser(user)
    return user
  }

  async nameIsAvailable(id: number, name: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where name = ? and id != ?) as exist',
      [name, id]
    )
    return r[0].exist === 0
  }

  async homeIsAvailable(id: number, home: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where home = ? and id != ?) as exist',
      [home, id]
    )
    return r[0].exist === 0

  }

  async emailIsAvailable(id: number, email: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where email = ? and id != ?) as exist',
      [email, id]
    )
    return r[0].exist === 0
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

  async deactivateUser(id: number) {
    const r = await this.db.query('update user set status = "d" where id = ?', id)
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

  async getCachedById(id: number): Promise<User | undefined> {
    let user = this.userIdMap.get(id)
    if (user) {
      return user
    }
    user = await this.findUserById(id)
    if (user) this.cache(user)
    return user
  }

  getStrictlyCachedById(id: number): User | undefined {
    return this.userIdMap.get(id)
  }

  async getCachedByHome(home: string): Promise<User | undefined> {
    let user = this.userHomeMap.get(home.toLowerCase())
    if (user) {
      return user
    }
    user = await this.findUserByHome(home)
    if (user) this.cache(user)
    return user
  }

  getStrictlyCachedByHome(home: string): User | undefined {
    return this.userHomeMap.get(home.toLowerCase())
  }

  async getRecachedByEmail(email: string): Promise<User | undefined> {
    const user = await this.findUserByEmail(email)
    if (user) {
      this.deleteCacheById(user.id)
      this.cache(user)
    }
    return user
  }

  async listUser(offset: number = 0, ps: number = 100) {
    const q = 'select id, name, home from user order by pdate desc limit ?, ?'
    const r = await this.db.query(q, [offset, ps])
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

}

function unpackUser(user: User) {
  // admin 컬럼은 bool 타입이고, bool 은 실제로 tinyint(1) 다.
  // 저장할 때는 true, false 를 사용해도 되지만 읽을 때는 number 가 돌아온다.
  user.admin = user.admin as unknown === 1
}