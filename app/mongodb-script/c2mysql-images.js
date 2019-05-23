'use strict';

const init = require('../base/init');
const config = require('../base/config');
const date2 = require('../base/date2');
const mongo2 = require('../mongodb/mongo2');
const my2 = require('../mysql/my2');
const imageb = require('../image/image-base');

init.add(
  (done) => {
    console.log('copy mongodb images to mysql image.');
    let c = 0;
    let cursor = mongo2.db.collection('images').find().sort({ id: 1 });
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
        my2.query('replace into image set ?', img, (err) => {
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
