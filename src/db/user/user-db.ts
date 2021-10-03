import { DB } from '../_db/db.js'
import { User } from '../../_type/user.js'
import { Config } from '../../_type/config.js'
import { UserForList } from '../../_type/user-view.js'

export class UserDB {

  public readonly config: Config
  private readonly db: DB
  private nextId: number

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
    this.nextId = 0
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
    this.nextId = await this.db.getMaxId('user')
    this.nextId++
    return this
  }

  async dropTable() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists user')
  }

  // ID

  getNextId() {
    return this.nextId++
  }

  setNextId(id: number) {
    this.nextId = id
  }

  // Query

  async insertUser(user: User) {
    return this.db.query('insert into user set ?', user)
  }

  async findUserById(id: number) {
    const r = await this.db.queryOne('select * from user where id = ?', id)
    if (r) unpack(r)
    return r as User | undefined
  }

  async findUserByEmail(email: string) {
    const r = await this.db.queryOne('select * from user where email = ?', email)
    if (r) unpack(r)
    return r as User | undefined
  }

  async findUserByHome(home: string) {
    const r = await this.db.queryOne('select * from user where home = ?', home)
    if (r) unpack(r)
    return r as User | undefined
  }

  async findUserList(offset: number = 0, ps: number = 100) {
    const r = await this.db.query(
      'select id, name, home from user order by pdate desc limit ?, ?',
      [offset, ps]
    )
    return r as UserForList[]
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
    return r as UserForList[]
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

  async updateUser(id: number, update: Partial<User>) {
    const r = await this.db.query('update user set ? where id = ?', [update, id])
    return r.changedRows as number
  }

  async updateHash(email: string, hash: string) {
    const r = await this.db.query('update user set hash = ? where email = ?', [hash, email])
    return r.changedRows as number
  }

  async updateADate(id: number, now: Date) {
    const r = await this.db.query('update user set adate = ? where id = ?', [now, id])
    return r.changedRows as number
  }

  async updatePDate(id: number, d: Date) {
    const r = await this.db.query('update user set pdate = ? where id = ?', [d, id])
    return r.changedRows as number
  }

  async updateStatus(id: number, s: string) {
    const r = await this.db.query('update user set status = ? where id = ?', [s, id])
    return r.changedRows as number
  }

}

function unpack(user: User) {
  // admin 컬럼은 bool 타입이고, bool 은 실제로 tinyint(1) 다.
  // 저장할 때는 true, false 를 사용해도 되지만 읽을 때는 number 가 돌아온다.
  user.admin = user.admin as unknown === 1
}

function unpackUserList(users: User[]) {
  for (const user of users) {
    user.admin = user.admin as unknown === 1
  }
}
