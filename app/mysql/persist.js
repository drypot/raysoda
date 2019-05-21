'use strict';

const init = require('../base/init');
const my2 = require('./my2');
const persist = exports;

// general json table

init.add(
  (done) => {
    my2.query(`
      create table if not exists persist(
        id varchar(128) not null,
        v json not null,
        primary key (id)
      )
    `, done);
  }
);

persist.find = function (id, done) {
  my2.queryOne('select * from persist where id = ?', id, (err, r) => {
    if (err) return done(err);
    done(null, r ? JSON.parse(r.v) : null);
  });
};

persist.update = function (id, v, done) {
  my2.query(
    'replace into persist values(?, ?)',
    [id, JSON.stringify(v)],
    done
  );
};
