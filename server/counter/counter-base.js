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

counterb.update = function (id, next) {
  var query = { _id: id };
  counterb.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};

counterb.updateDaily = function (id, next) {
  var query = { _id: id + util2.toDateStringNoDash(new Date()) };
  counterb.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};
