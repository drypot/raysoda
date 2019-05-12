'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const init = require('../base/init');
const error = require('../base/error');
const config = require('../base/config');
const mysql2 = require('../mysql/mysql2');
var userb = exports;

error.define('NOT_AUTHENTICATED', '먼저 로그인해 주십시오.');
error.define('NOT_AUTHORIZED', '사용 권한이 없습니다.');
error.define('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.');
error.define('EMAIL_NOT_FOUND', '등록되지 않은 이메일입니다.', 'email');
error.define('ACCOUNT_DEACTIVATED', '사용중지된 계정입니다.', 'email');
error.define('PASSWORD_WRONG', '비밀번호가 틀렸습니다.', 'password');

error.define('NAME_EMPTY', '이름을 입력해 주십시오.', 'name');
error.define('NAME_RANGE', '이름 길이는 1 ~ 32 글자입니다.', 'name');
error.define('NAME_DUPE', '이미 등록되어 있는 이름입니다.', 'name');

error.define('HOME_EMPTY', '개인 주소를 입력해 주십시오.', 'home');
error.define('HOME_RANGE', '개인 주소 길이는 1 ~ 32 글자입니다.', 'home');
error.define('HOME_DUPE', '이미 등록되어 있는 개인 주소입니다.', 'home');

error.define('EMAIL_EMPTY', '이메일 주소를 입력해 주십시오.', 'email');
error.define('EMAIL_RANGE', '이메일 주소 길이는 8 ~ 64 글자입니다.', 'email');
error.define('EMAIL_PATTERN', '이메일 형식이 잘못되었습니다.', 'email');
error.define('EMAIL_DUPE', '이미 등록되어 있는 이메일입니다.', 'email');

error.define('PASSWORD_EMPTY', '비밀번호를 입력해 주십시오.', 'password');
error.define('PASSWORD_RANGE', '비밀번호 길이는 4 ~ 32 글자입니다.', 'password');

error.define('EMAIL_NOT_EXIST', '등록되지 않은 이메일입니다.', 'email');
error.define('RESET_TIMEOUT', '비밀번호 초기화 토큰 유효시간이 지났습니다.');

// users collection

var userId;

init.add(
  (done) => {
    mysql2.query(`
      create table if not exists user(
        id int not null,
        name varchar(32) not null,
        namel varchar(32) not null,
        home varchar(32) not null,
        homel varchar(32) not null,
        email varchar(64) not null,
        hash char(60) character set latin1 collate latin1_bin not null,
        status char(1) not null,
        admin bool not null,
        cdate datetime(3) not null,
        adate datetime(3) not null,
        pdate datetime(3) not null,
        profile text not null,
        primary key (id)
      )
    `, done);
  },
  (done) => {
    mysql2.query(`
      create index user_email on user(email);
    `, () => { done(); });
  },
  (done) => {
    mysql2.query(`
    create index user_namel on user(namel);
    `, () => { done(); });
  },
  (done) => {
    mysql2.query(`
    create index user_homel on user(homel);
    `, () => { done(); });
  },
  (done) => {
    mysql2.query(`
    create index user_pdate on user(pdate desc);
    `, () => { done(); });
  },
  (done) => {
    mysql2.getMaxId('user', (err, id) => {
      if (err) return done(err);
      userId = id;
      done();
    });
  }
);

userb.getNewId = function () {
  return ++userId;
};

userb.getNewUser = function () {
  var now = new Date();
  return { 
    id: 0, 
    name: '', 
    namel: '', 
    home: '', 
    homel: '', 
    email: '',
    hash: '',
    status: 'v',
    admin : false,
    cdate: now,
    adate: now,
    pdate: now,
    profile: ''
  };
};

// bcrypt hash

userb.makeHash = function (pw, cb) {
  bcrypt.hash(pw, 10, cb);
}

userb.checkPassword = function (pw, hash, cb) {
  return bcrypt.compare(pw, hash, cb);
}

// user cache

var usersById = new Map;
var usersByHome = new Map;

userb.unpackUser= function (user) {
  user.admin = !!user.admin;
};

userb.cache = function (user) {
  usersById.set(user.id, user);
  usersByHome.set(user.homel, user);
}

userb.getCached = function (id, done) {
  var user = usersById.get(id);
  if (user) {
    return done(null, user);
  }
  mysql2.queryOne('select * from user where id = ?', id, (err, user) => {
    if (err) return done(err);
    if (!user) return done(error('USER_NOT_FOUND'));
    userb.unpackUser(user);
    userb.cache(user);
    done(null, user);
  });
};

userb.getCachedByHome = function (homel, done) {
  var user = usersByHome.get(homel);
  if (user) {
    return done(null, user);
  }
  mysql2.queryOne('select * from user where homel = ?', homel, (err, user) => {
    if (err) return done(err);
    if (!user) {
      // 사용자 프로필 URL 검색에 주로 사용되므로 error 생성은 패스한다.
      return done();
    }
    userb.unpackUser(user);
    userb.cache(user);
    done(null, user);
  });
};

userb.deleteCache = function (id) {
  var user = usersById.get(id);
  if (user) {
    usersById.delete(id);
    usersByHome.delete(user.homel);
  }
}

userb.resetCache = function () {
  usersById = new Map;
  usersByHome = new Map;
}
