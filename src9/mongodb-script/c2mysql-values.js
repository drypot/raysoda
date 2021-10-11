'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
import * as db from '../db/db.js';
const persist = require('../db/db-persist');

init.add(
  (done) => {
    console.log('copy mongodb values to mysql persist.');
    let c = 0;
    let cursor = mongo2.db.collection('values').find().sort({ _id: 1 });
    (function read() {
      cursor.next(function (err, r) {
        if (err) return done(err);
        if (!r) return done();
        c++;
        if (c % 100 === 0) {
          process.stdout.write(c + ' ');
        }
        r.id = r._id;
        delete r._id;
        r.v = JSON.stringify(r.v);
        db.query('replace into persist set ?', r, (err) => {
          if (err) return done(err);
          setImmediate(read);
        });
      });
    })();
  },
  (done) => {
    mongo2.close(done);
  },
  (done) => {
    db.close(done);
  },
  (done) => {
    console.log('done.');
    done();
  }
);

init.run();
