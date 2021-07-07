import * as assert2 from "../base/assert2.mjs";
import * as init from "../base/init.mjs";
import * as db from '../db/db.mjs';
import * as expl from "../express/express-local.mjs";
import * as usera from "../user/user-auth.mjs";
import * as userb from "../user/user-base.mjs";

export const users = {};

export function recreate(done) {
  userb.resetCache();
  db.query('truncate table user', (err) => {
    if (err) return done(err);
    const forms = [
      {name: 'user1', email: 'user1@mail.com', password: '1234', pdate: new Date(2019, 0, 10)},
      {name: 'user2', email: 'user2@mail.com', password: '1234', pdate: new Date(2019, 0, 20)},
      {name: 'user3', email: 'user3@mail.com', password: '1234', pdate: new Date(2019, 0, 15)},
      {name: 'admin', email: 'admin@mail.com', password: '1234', pdate: new Date(2019, 0, 5), admin: true}
    ];
    let i = 0;
    (function create() {
      if (i === forms.length) {
        return done();
      }
      const form = forms[i++];
      userb.makeHash(form.password, function (err, hash) {
        assert2.ifError(err);
        let user = userb.getNewUser();
        user.id = userb.getNewId();
        user.name = form.name;
        user.home = form.name;
        user.email = form.email;
        user.hash = hash;
        user.pdate = form.pdate;
        user.admin = !!form.admin;
        db.query('insert into user set ?', user, (err) => {
          assert2.ifError(err);
          user.password = form.password;
          users[user.name] = user;
          setImmediate(create);
        });
      });
    })();
  });
}

init.add(recreate);

export function login(name, remember, done) {
  if (typeof remember == 'function') {
    done = remember;
    remember = false;
  }
  const user = users[name];
  const form = {email: user.email, password: user.password, remember: remember};
  expl.post('/api/users/login').send(form).end(done);
}

export function logout(done) {
  expl.post('/api/users/logout', done);
}
