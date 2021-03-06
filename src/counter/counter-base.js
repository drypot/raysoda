import * as assert2 from "../base/assert2.js";
import * as init from "../base/init.js";
import * as date2 from "../base/date2.js";
import * as db from '../db/db.js';

init.add(
  (done) => {
    db.query(`
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

export function update(id, date, done) {
  let dateStr = date2.dateString(date);
  db.query(
    'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
    [id, dateStr],
    done
  );
}
