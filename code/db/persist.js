import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as db from '../db/db.js';

// general json table

init.add(
  (done) => {
    db.query(`
      create table if not exists persist(
        id varchar(128) not null,
        v text(65535) not null,
        primary key (id)
      )
    `, done);
  }
);

export function find(id, done) {
  db.queryOne('select * from persist where id = ?', id, (err, r) => {
    if (err) return done(err);
    done(null, r ? JSON.parse(r.v) : null);
  });
}

export function update(id, v, done) {
  db.query(
    'replace into persist values(?, ?)',
    [id, JSON.stringify(v)],
    done
  );
}
