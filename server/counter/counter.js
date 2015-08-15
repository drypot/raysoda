var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var util2 = require('../base/util2');
var mongob = require('../mongo/mongo-base');
var counter = exports;

init.add(function (done) {
  counter.counters = mongob.db.collection('counters');
  done();
});

counter.update = function (id, next) {
  var query = { _id: id };
  counter.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};

counter.updateDaily = function (id, next) {
  var query = { _id: id + util2.toDateStringNoDash(new Date()) };
  counter.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};
