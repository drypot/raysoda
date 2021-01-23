'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const my2 = require('../mysql/my2');
const persist = require('../mysql/persist');

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
        my2.query('replace into persist set ?', r, (err) => {
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
    my2.close(done);
  },
  (done) => {
    console.log('done.');
    done();
  }
);

init.run();
