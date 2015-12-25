'use strict';

var init = require('../base/init');
var userb = require('../user/user-base');
var usera = require('../user/user-auth');
var expl = require('../express/express-local');
var assert = require('assert');
var assert2 = require('../base/assert2');
var userf = exports;

init.add(exports.recreate = function (done) {
  userb.resetCache();
  userb.users.deleteMany(function (err) {
    if (err) return done(err);
    var forms = [
      { name: 'user1', email: 'user1@mail.com', password: '1234' },
      { name: 'user2', email: 'user2@mail.com', password: '1234' },
      { name: 'user3', email: 'user3@mail.com', password: '1234' },
      { name: 'admin', email: 'admin@mail.com', password: '1234', admin: true }
    ];
    var i = 0;
    (function create() {
      if (i == forms.length) {
        return done();
      }
      var form = forms[i++];
      var now = new Date();
      userb.makeHash(form.password, function (err, hash) {
        assert.ifError(err);
        var user = {
          _id: userb.getNewId(),
          name: form.name,
          namel: form.name,
          home: form.name,
          homel: form.name,
          email: form.email,
          hash: hash,
          status: 'v',
          cdate: now,
          adate: now,
          profile: '',
        };
        if (form.admin) {
          user.admin = true;
        }
        userb.users.insertOne(user, function (err) {
          assert.ifError(err);
          user.password = form.password;
          exports[user.name] = user;
          setImmediate(create);
        });
      });
    })();
  });
});

userf.login = function (name, remember, done) {
  if (typeof remember == 'function') {
    done = remember;
    remember = false;
  }
  var user = exports[name];
  var form = { email: user.email, password: user.password, remember: remember };
  expl.post('/api/users/login').send(form).end(done);
};

userf.logout = function (done) {
  expl.post('/api/users/logout', done);
}
