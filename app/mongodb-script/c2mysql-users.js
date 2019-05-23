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
        /*
              id int not null,
        name varchar(32) not null,
        home varchar(32) not null,
        email varchar(64) not null,
        hash char(60) character set latin1 collate latin1_bin not null,
        status char(1) not null,
        admin bool not null,
        cdate datetime(3) not null,
        adate datetime(3) not null,
        pdate datetime(3) not null,
        profile text not null,
        */
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
        images.findOne({ uid: r.id }, imageOpt, (err, image) => {
          if (err) return done(err);
          user.pdate = image ? image.cdate : r.cdate;
          my2.query('replace into user set ?', user, (err) => {
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
