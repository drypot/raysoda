'use strict';

const init = require('../base/init');
const date2 = require('../base/date2');
const my2 = require('../mysql/my2');
const counterb = exports;

init.add(
  (done) => {
    my2.query(`
      create table if not exists counter(
        id varchar(64) not null,
        d char(10) not null,
        c int not null,
        primary key (id, d)
      )
      charset latin1 collate latin1_bin 
    `, done);
  },
);

counterb.update = function (id, date, done) {
  let dateStr = date2.makeDateString(date);
  my2.query(
    'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
    [id, dateStr],
    done
  );
};
