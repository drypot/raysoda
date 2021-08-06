// users collection

import { DBConn } from '../db/db-conn.js'
import { queryCallback } from 'mysql'
import { Done, waterfall } from '../../lib/base/async2.js'
import { User } from './user-domain.js'

export class UserDB {

  private conn: DBConn
  private userId: number

  constructor(conn: DBConn) {
    this.conn = conn
    this.userId = 0
  }

  createTable(done: queryCallback) {
    waterfall(
      (done: Done) => {
        const qa = [
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
          ')',
          'create index user_email on user(email)',
          'create index user_name on user(name)',
          'create index user_home on user(home)',
          'create index user_pdate on user(pdate desc)',
        ]
        this.conn.runQueries(qa, done)
      },
      (done: Done) => {
        this.conn.getMaxId('user', (err, id) => {
          if (err) return done(err)
          this.userId = id ?? 0
          done()
        })
      },
      done
    )
  }

  getNewId() {
    return ++this.userId
  }

  // user cache

  private usersById = new Map
  private usersByHome = new Map

  cache(user: User) {
    this.usersById.set(user.id, user)
    this.usersByHome.set(user.home.toLowerCase(), user)
  }

  getCached(id: number, done: (err: any, user?: User) => void) {
    const user = this.usersById.get(id)
    if (user) {
      return done(null, user)
    }
    this.findUserById(id, (err, user) => {
      if (err) return done(err)
      if (user) this.cache(user)
      done(null, user)
    })
  }

  getCachedByHome(home: string, done: (err: any, user?: User) => void) {
    const user = this.usersByHome.get(home.toLowerCase())
    if (user) {
      return done(null, user)
    }
    this.findUserByHome(home, (err, user) => {
      if (err) return done(err)
      if (user) this.cache(user)
      done(null, user)
    })
  }

  deleteCache(id: number) {
    const user = this.usersById.get(id)
    if (user) {
      this.usersById.delete(id)
      this.usersByHome.delete(user.home.toLowerCase())
    }
  }

  resetCache() {
    this.usersById = new Map
    this.usersByHome = new Map
  }

  // query

  findUserById(id: number, done: (err: any, user?: User) => void) {
    this.conn.queryOne('select * from user where id = ?', id, (err, user) => {
      if (err) return done(err)
      if (user) unpackUser(user)
      done(null, user)
    })
  }

  findUserByHome(home: string, done: (err: any, user?: User) => void) {
    this.conn.queryOne('select * from user where home = ?', home, (err, user) => {
      if (err) return done(err)
      if (user) unpackUser(user)
      done(null, user)
    })
  }
}

function unpackUser(user: User) {
  user.admin = !!user.admin
}
