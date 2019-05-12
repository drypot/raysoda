'use strict';

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const my2 = require('../mysql/my2');
var counterb = exports;

init.add(function (done) {
  counterb.counters = mongo2.db.collection('counters');
  counterb.counters.createIndex({ id: 1, d: 1 }, done);
});

counterb.update = function (id, date, done) {
  var query = { id: id };
  if (done) {
    query.d = date;
  } else {
    done = date;
  }
  counterb.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, done);
};
