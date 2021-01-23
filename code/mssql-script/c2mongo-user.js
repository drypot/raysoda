'use strict';

const tds = require('tedious');
const types = tds.TYPES;
const init = require('../base/init');
const config = require('../base/config');
const mongo2 = require('../mongodb/mongo2');
const userb = require('../user/user-base');

/*
  $ node code/mig-raysoda/mig-user.js -c config/mig-1-dev.json 1 10
*/

/*
  SQL Server

  table Users (
    UserID    int not null
    ,Status   char(1) not null -- Status : N:New  C:Common  T:Terminated -> v: valid, d: deactivated
    ,CDate    datetime not null default getdate()
    ,ADate    datetime not null default getdate()
    ,PDate    datetime not null default getdate() -- 최근 업로드 시간, 삭제 대상
    ,PhotoCnt int not null default 0 -- 삭제
    ,Rating   int not null default 0 -- 삭제
    ,FavCnt   int not null default 0 -- 삭제

    ,FIcon    char(1) not null default 'N' -- 삭제
    ,FMusic   char(1) not null default 'N' -- 삭제
    ,FScore   char(1) not null default 'Y' -- 삭제
    ,FGoC   char(1) not null default 'Y' -- 추천후 Go to Catalog -- 삭제
    ,FPanel   char(1) not null default 'N' -- 삭제
    ,FDisWrite  char(1) not null default 'N' -- 삭제
    ,FSeed    char(1) not null default 'Y' -- 초대 가능 여부, 삭제

    ,HomePubPhotoCount    int not null default '5' -- 삭제
    ,HomeBoxPhotoCount    int not null default '5' -- 삭제
    ,HomeBoxPhotoFeaturedOn char(1) not null default 'N' -- 삭제
    ,HomeNoteOn         char(1) not null default 'Y' -- 삭제

    ,BoxUsedSize  bigint not null default 0 -- 개인용량 사용량, 삭제
    ,BoxSID   nvarchar(16) not null default '' --> home, homel
    ,BoxDesc  nvarchar(32) not null default '' --> AKI's home 등, 삭제

    ,NickName nvarchar(32) not null -- AKI
    ,RealName nvarchar(32) not null -- 박규현 -- 삭제
    ,Password nvarchar(16) not null
    ,Email    nvarchar(64) not null
    ,HomePage varchar(256) not null default '' -- 삭제

    ,Tel    varchar(32) not null -- 삭제
    ,Address  nvarchar(64) not null -- 삭제
    ,ZipCode  char(6) not null -- 삭제

    ,Comment  ntext not null제 --> profile

    ,Greeting ntext not null default '' -- 삭제
    ,Profile  ntext not null default '' -- 삭제
    ,Career   ntext not null default '' -- 삭제

    ,primary key (UserID)

  table UserFavs (
    OwnerUserID   int not null
    ,TargetUserID int not null
    ,primary key (OwnerUserID, TargetUserID)
*/

init.main(function (done) {
  if (config.argv._.length != 2) {
    console.log('Start and end ids should be specified.');
    return done();
  }
  var conn = new tds.Connection(config.sql);
  conn.on('connect', function (err) {
    if (err) return done(err);
    var s = config.argv._[0];
    var e = config.argv._[1];
    var cnt = 0;
    var req = new tds.Request('select UserID, NickName, BoxSID, Email, Password, Status, CDate, ADate, Comment, HomePage from Users where UserID between @s and @e order by UserID', function (err, c) {
      if (err) return done(err);
      console.log(c + ' sql rows read');
      done();
    });
    req.addParameter('s', types.Int, s);
    req.addParameter('e', types.Int, e);
    req.on('row', function (cs) {
      var _id = cs[0].value;
      userb.makeHash(cs[4].value, function (err, hash) {
        if (err) return done(err);
        var homepage = cs[9].value ? cs[9].value + '\n\n' : '';
        var user = {
          _id: _id,
          name: cs[1].value,
          namel: cs[1].value.toLowerCase(),
          home: cs[2].value,
          homel: cs[2].value.toLowerCase(),
          email: cs[3].value,
          hash: hash,
          status: cs[5].value == 'T' ? 'd' : 'v',
          cdate: cs[6].value,
          adate: cs[7].value,
          profile: homepage + cs[8].value
        };
        userb.users.updateOne({ _id: _id }, { $set: user }, { upsert: true }, function (err) {
          if (err) return done(err);
          cnt++;
          if (cnt % 100 == 0) {
            console.log(_id);
          }
        });
      });
    });
    conn.execSql(req);
  });
  conn.on('error', function(err) {
    done(err);
  });
});

