'use strict';

const mysql = require('mysql');
const init = require('../base/init');
const config = require('../base/config');
const async = require('../base/async');
const my2 = exports;

// db

var conn;

// 작업 종료후 pool을 닫으면 큐잉된 쿼리는 실행되지 못하고 'Pool is closed' 를 뿜는다.
// 이 문제가 해결되기 전까지 pool 사용을 피한다.
//
//var pool;

// 광역 typeCast 는 안 하기로 한다.
//
function typeCast(field, next) {
  
  // console.log('---');
  // console.log(field.name);
  // console.log(field.type);
  
  if (field.type === 'TINY' && field.length === 1) {
    let v = field.string();
    //console.log(v);
    return v === '1';
  }
  
  // JSON 이 JSON 으로 오지 않고 BLOB 으로 온다.
  // 다른 정보가 BLOB 으로 오면 구분할 수가 없다.
  //  
  // if (field.type === 'BLOB') {
  //   let v = JSON.parse(field.string());
  //   //console.log(v);
  //   return v;
  // }

  return next();
}

init.add(
  (done) => {
    my2.conn = conn = mysql.createConnection({
      host: 'localhost',
      user: config.mysqlUser,
      password: config.mysqlPassword,
      charset: 'utf8mb4',
      multipleStatements: true,
      //typeCast: typeCast,
    });
    done();
  },
  (done) => {
    if (my2.dropDatabase) {
      console.log('mysql: dropping db, ' + config.mysqlDatabase);
      conn.query('drop database if exists ??', config.mysqlDatabase, done);
    } else {
      done();
    }
  },
  (done) => {
    console.log('mysql: db=' + config.mysqlDatabase);
    conn.query('create database if not exists ?? character set utf8mb4', config.mysqlDatabase, done);
  },
  (done) => {
    conn.changeUser({ database: config.mysqlDatabase }, done);
  },
  // (done) => {
  //   my2.pool = pool = mysql.createPool({
  //     connectionLimit: 10,
  //     host: 'localhost',
  //     database: config.mysqlDatabase,
  //     user: config.mysqlUser,
  //     password: config.mysqlPassword,
  //     charset: 'utf8mb4',
  //     multipleStatements: true,
  //     typeCast: typeCast,
  //   });
  //   done();
  // }
);

my2.close = function (done) {
  async.wf(
    (done) => {
      if (conn) {
        conn.end(done);
      } else {
        done();
      }
    },
    // (done) => {
    //   if (pool) {
    //     pool.end(done);
    //   } else {
    //     done();
    //   }
    // },
    done
  );
}

// utilities

my2.query = function () {
  //pool.query.apply(pool, arguments);
  conn.query.apply(conn, arguments);
};

my2.queryOne = function (sql, param, done) {
  if (!done) {
    done = param;
    param = null;
  }
  //pool.query(sql, param, (err, r, f) => {
  conn.query(sql, param, (err, r, f) => {
    if (err) return done(err);
    done(null, r[0], f);  
  });
};

my2.getMaxId = function (table, done) {
  my2.queryOne('select coalesce(max(id), 0) as maxId from ??', table, (err, r) => {
    if (err) return done(err);
    done(null, r.maxId);
  });
};

my2.tableExists = function (name, done) {
  my2.query('show tables like ?', name, (err, r) => {
    if (err) return done(err);
    done(null, !!r.length);
  });
};
