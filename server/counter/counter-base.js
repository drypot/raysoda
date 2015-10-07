var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var util2 = require('../base/util2');
var mongob = require('../mongo/mongo-base');
var counterb = exports;

init.add(function (done) {
  counterb.counters = mongob.db.collection('counters');
  done();
});

counterb.find = function (id, date, done) {
  if (done) {
    id = id + util2.toDateStringNoDash(date);
  } else {
    done = date;
  }
  counterb.counters.findOne({ _id: id }, function (err, doc) {
    done(err, doc ? doc.c : null);
  });
};

counterb.update = function (id, done) {
  var query = { _id: id };
  counterb.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, done);
};

counterb.updateDaily = function (id, done) {
  var query = { _id: id + util2.toDateStringNoDash(new Date()) };
  counterb.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, done);
};

