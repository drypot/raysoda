'use strict';

const init = require('../base/init');
const my2 = require('../mysql/my2');
const userb = require('../user/user-base');
const usera = require('../user/user-auth');
const expl = require('../express/express-local');
const assert = require('assert');
const assert2 = require('../base/assert2');
var userf = exports;

init.add(exports.recreate = function (done) {
  userb.resetCache();
  my2.query('truncate table user', (err) => {
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
      userb.makeHash(form.password, function (err, hash) {
        assert.ifError(err);
        let user = userb.getNewUser();
        user.id = userb.getNewId();
        user.name = form.name;
        user.namel = form.name;
        user.home = form.name;
        user.homel = form.name;
        user.email = form.email;
        user.hash = hash;
        user.admin = !!form.admin;
        my2.query('insert into user set ?', user, (err) => {
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
