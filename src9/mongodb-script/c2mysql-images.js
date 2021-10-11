'use strict';

const init = require('../base/init');
const config = require('../base/config');
const date2 = require('../base/date2');
const mongo2 = require('../mongodb/mongo2');
import * as db from '../db/db.js';
import * as imageb from '../image/image-base.js';

init.add(
  (done) => {
    console.log('copy mongodb images to mysql image.');
    done();
  },
  (done) => {
    db.query('start transaction', done);
  },
  (done) => {
    let c = 0;
    let cursor = mongo2.db.collection('images').find();
    (function read() {
      cursor.next(function (err, r) {
        if (err) return done(err);
        if (!r) return done();
        c++;
        if (c % 100 === 0) {
          process.stdout.write(c + ' ');
        }
        let img = {
          id: r._id,
          uid: r.uid,
          cdate: r.cdate,
          vers: JSON.stringify(r.vers || null),
          comment: r.comment,
        }
        db.query('replace into image set ?', img, (err) => {
          if (err) return done(err);
          setImmediate(read);
        });
      });
    })();
  },
  (done) => {
    db.query('commit', done);
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
