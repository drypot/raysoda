'use strict';

var tds = require('tedious');
var types = tds.TYPES;

var init = require('../base/init');
var config = require('../base/config');
var mongo2 = require('../mongo/mongo2');
var imageb = require('../image/image-base');

/*
  $ node app/mig-raysoda/mig-image-db.js -c config/mig-1-dev.json 1 10
*/

/*
  SQL Server

  table Photos (
    PhotoID int not null
    ,UserID int not null
    ,CDate datetime not null default getdate()
    ,UDate datetime not null default getdate() -- 삭제 고
    ,Rating int not null default 0
    ,PanelRating int not null default 0 -- 삭제
    ,Hit int not null default 0 -- 삭제 고려
    ,Border tinyint not null default 1 -- 삭제
    ,Title nvarchar(128) not null default '' -- 삭제 고려
    ,Comment ntext not null default ''
    --,Exif ntext not null default '' -- 삭제
    ,Music varchar(1024) default '' -- 삭제
    ,primary key nonclustered (PhotoID)
  )
  go

  create index UserCDateIdx on Photos(UserID, CDate desc)
  create clustered index CDateIdx on Photos(CDate desc)

  -----

  table PhotoCategories (
    CategoryID smallint not null
    ,[Desc] nvarchar(32) not null
    ,primary key (CategoryID)
  ) -- 삭제

  table CategoriesPhotos (
    CategoryID smallint not null
    ,PhotoID int not null
    ,primary key (CategoryID, PhotoID)
  ) -- 삭제

  view CategoriesCDatesPhotos with schemabinding -- 삭제
  as
  select CategoryID, CDate, C.PhotoID
  from dbo.CategoriesPhotos C join dbo.Photos P on C.PhotoID = P.PhotoID
  go

  -----

  table PhotoCrits (
    PhotoID int not null
    ,UserID int not null
    --,PUserID int not null
    ,CDate datetime not null default getdate()
    ,Rating tinyint not null default 1
    ,Comment nvarchar(4000) not null default ''
    ,primary key nonclustered (PhotoID, UserID)
  )
  go

  create clustered index PhotoCDateIdx on PhotoCrits(PhotoID, CDate)
  create index UserCDatePhotoIdx on PhotoCrits(UserID, CDate, PhotoID)
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
    var req = new tds.Request('select PhotoID, UserID, CDate, Title, Comment from Photos where PhotoID between @s and @e order by PhotoID', function (err, c) {
      if (err) return done(err);
      console.log(c + ' sql rows read');
      done();
    });
    req.addParameter('s', types.Int, s);
    req.addParameter('e', types.Int, e);
    req.on('row', function (cs) {
      var _id = cs[0].value;
      var image = {
        _id: _id,
        uid: cs[1].value,
        cdate: cs[2].value
      };
      var title = cs[3].value;
      var comment = cs[4].value;
      if (title) {
        if (comment) {
          image.comment = title + '\n\n' + comment;
        } else {
          image.comment = title;
        }
      } else {
        image.comment = comment;
      }
      imageb.images.updateOne({ _id: _id }, { $set: image }, { upsert: true }, function (err) {
        if (err) return done(err);
        cnt++;
        if (cnt % 100 == 0) {
          console.log(_id);
        }
      });
    });
    conn.execSql(req);
  });
  conn.on('error', function(err) {
    done(err);
  });
});

