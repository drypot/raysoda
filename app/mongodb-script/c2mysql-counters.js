'use strict';

const init = require('../base/init');
const config = require('../base/config');
const date2 = require('../base/date2');
const mongo2 = require('../mongodb/mongo2');
const my2 = require('../mysql/my2');
const counterb = require('../counter/counter-base');

init.add(
  (done) => {
    console.log('copy mongodb counters to mysql counter.');
    let c = 0;
    let cursor = mongo2.db.collection('counters').find().sort({ id: 1, d: 1 });
    (function read() {
      cursor.next(function (err, r) {
        if (err) return done(err);
        if (!r) return done();
        c++;
        if (c % 100 === 0) {
          process.stdout.write(c + ' ');
        }
        delete r._id;
        r.d = date2.makeDateString(r.d);
        my2.query('replace into counter set ?', r, (err) => {
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
