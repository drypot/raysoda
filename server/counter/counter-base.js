'use strict';

var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var util2 = require('../base/util2');
var mongo2 = require('../mongo/mongo2');
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
