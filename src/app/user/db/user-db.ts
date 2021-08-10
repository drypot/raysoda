import { DB } from '../../../lib/db/db.js'
import { User } from '../entity/user-entity.js'

export class UserDB {

  private db: DB
  private nextUserId: number

  constructor(db: DB) {
    this.db = db
    this.nextUserId = 0
  }

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
  }

  async dropTable() {
    if (!this.db.droppable) {
      throw (new Error('can not drop in production mode.'))
    }
    await this.db.query('drop table if exists user')
  }

  getNextUserId() {
    return this.nextUserId++
  }

  setNextUserId(nextId: number) {
    this.nextUserId = nextId
  }

  async insertUser(user: User) {
    await this.db.query('insert into user set ?', user)
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

  async checkNameUsable(id: number, name: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where name = ? and id != ?) as exist',
      [name, id]
    )
    return r[0].exist === 0
  }

  async checkHomeUsable(id: number, home: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where home = ? and id != ?) as exist',
      [home, id]
    )
    return r[0].exist === 0

  }

  async checkEmailUsable(id: number, email: string): Promise<boolean> {
    const r = await this.db.query(
      'select exists(select * from user where email = ? and id != ?) as exist',
      [email, id]
    )
    return r[0].exist === 0
  }

}

function unpackUser(user: User) {
  user.admin = !!user.admin
}
