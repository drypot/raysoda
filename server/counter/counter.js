var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var utilp = require('../base/util');
var mongop = require('../mongo/mongo');
var counter = exports;

init.add(function (done) {
  counter.counters = mongop.db.collection('counters');
  done();
});

counter.update = function (id, next) {
  var query = { _id: id };
  counter.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};

counter.updateDaily = function (id, next) {
  var query = { _id: id + utilp.toDateStringNoDash(new Date()) };
  counter.counters.updateOne(query, { $inc: { c: 1 }}, { upsert: true }, next);
};
