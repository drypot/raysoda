'use strict';

const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const my2 = require('../mysql/my2');
const userb = require('../user/user-base');

init.add(
  (done) => {
    console.log('copy mongodb users to mysql user.');
    done();
  },
  (done) => {
    my2.query('start transaction', done);
  },
  (done) => {
    let c = 0;
    let cursor = mongo2.db.collection('users').find();
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
        let user = {
          id: r._id,
          name: r.name,
          home: r.home,
          email: r.email,
          hash: r.hash,
          status: r.status,
          admin: !!r.admin,
          cdate: r.cdate,
          adate: r.adate,
          profile: r.profile,
        }
        images.findOne({ uid: r._id }, imageOpt, (err, image) => {
          if (err) return done(err);
          user.pdate = image ? image.cdate : new Date(2000, 0, 1);
          my2.query('replace into user set ?', user, (err) => {
            if (err) return done(err);
            setImmediate(read);
          });
        });
      });
    })();
  },
  (done) => {
    my2.query('commit', done);
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
