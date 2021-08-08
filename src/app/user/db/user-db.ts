import { DB } from '../../../lib/db/db.js'
import { Done, waterfall } from '../../../lib/base/async2.js'
import { User } from '../domain/user-domain.js'

export class UserDB {

  private db: DB
  private userIdMax: number

  constructor(db: DB) {
    this.db = db
    this.userIdMax = 0
  }

  createTable(done: Done) {
    waterfall(
      (done) => {
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
        this.db.query(q, done)
      },
      (done) => {
        this.db.createIndexIfNotExists(
          'create index user_email on user(email)', done
        )
      },
      (done) => {
        this.db.createIndexIfNotExists(
          'create index user_name on user(name)', done
        )
      },
      (done) => {
        this.db.createIndexIfNotExists(
          'create index user_home on user(home)', done
        )
      },
      (done) => {
        this.db.createIndexIfNotExists(
          'create index user_pdate on user(pdate desc)', done
        )
      },
      (done) => {
        this.db.getMaxId('user', (err, id) => {
          if (err) return done(err)
          this.userIdMax = id ?? 0
          done()
        })
      }
    ).run(done)
  }

  dropTable(done: Done) {
    if (!this.db.droppable) {
      return done(new Error('can not drop in production mode.'))
    }
    this.db.query('drop table if exists user', done)
  }

  getNewUserId() {
    return ++this.userIdMax
  }

  insertUser(user: User, done: Done) {
    this.db.query('insert into user set ?', user, done)
  }

  findUserById(id: number, done: (err: any, user?: User) => void) {
    this.db.query('select * from user where id = ?', id, (err, r) => {
      if (err) return done(err)
      const user = r[0]
      if (user) unpackUser(user)
      done(null, user)
    })
  }

  findUserByEmail(email: string, done: (err: any, user?: User) => void) {
    this.db.query('select * from user where email = ?', email, (err, r) => {
      if (err) return done(err)
      const user = r[0]
      if (user) unpackUser(user)
      done(null, user)
    })
  }

  findUserByHome(home: string, done: (err: any, user?: User) => void) {
    this.db.query('select * from user where home = ?', home, (err, r) => {
      if (err) return done(err)
      const user = r[0]
      if (user) unpackUser(user)
      done(null, user)
    })
  }

  checkNameUsable(id: number, name: string, done: (err: any, usable: boolean) => void) {
    this.db.query(
      'select exists(select * from user where (name = ? or home = ?) and id != ?) as exist',
      [name, name, id],
      (err, r) => {
        done(err, r[0].exist === 0)
      }
    )
  }

  checkEmailUsable(id: number, email: string, done: (err: any, usable: boolean) => void) {
    this.db.query(
      'select exists(select * from user where email = ? and id != ?) as exist',
      [email, id],
      (err, r) => {
        done(err, r[0].exist === 0)
      }
    )
  }

}

function unpackUser(user: User) {
  user.admin = !!user.admin
}
