'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const my2 = require('../mysql/my2');
const userb = require('../user/user-base');

init.add(
  (done) => {
    console.log('copy mongodb users to mysql user.');
    let c = 0;
    let cursor = mongo2.db.collection('users').find().sort({ id: 1 });
    let images = mongo2.db.collection('images');
    let imageOpt = {
      sort: { _id: -1 },
      projection: { cdate : 1},
    };
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
        r.admin = !!r.admin;
        images.findOne({ uid: r.id }, imageOpt, (err, image) => {
          if (err) return done(err);
          r.pdate = image ? image.cdate : r.cdate;
          my2.query('replace into user set ?', r, (err) => {
            if (err) return done(err);
            setImmediate(read);
          });
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
