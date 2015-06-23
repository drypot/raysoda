var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var utilp = require('../base/util');
var exp = require('../express/express');
var upload = require('../express/upload');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var site = require('../image/image-site');

exp.core.get('/api/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, true, done);
});

exp.core.get('/images/:id([0-9]+)', function (req, res, done) {
  view(req, res, false, done);
});

/* TODO
hit 삭제를 고려
*/

function view(req, res, api, done) {
  var id = parseInt(req.params.id) || 0;
  utilp.fif(!api || req.query.hasOwnProperty('hit'), function (next) {
    imageb.images.updateOne({ _id: id }, { $inc: { hit: 1 }}, next);
  }, function (err) {
    if (err) return done(err);
    imageb.images.findOne({ _id: id }, function (err, image) {
      if (err) return done(err);
      if (!image) return done(error('IMAGE_NOT_EXIST'));
      userb.getCached(image.uid, function (err, user) {
        if (err) return done(err);
        image.user = {
          _id: user._id,
          name: user.name,
          home: user.home
        };
        image.dir = imageb.getUrlBase(image._id);
        image.cdateStr = utilp.toDateTimeString(image.cdate);
        image.cdate = image.cdate.getTime();
        if (api) {
          res.json(image);
        } else {
          var cuser = res.locals.user;
          res.render('image/image-view', {
            image: image,
            svg: site.svg,
            updatable: cuser && (image.user._id == cuser._id || cuser.admin),
            imageView: true
          });
        }
      });
    });
  });
}

/* TODO

procedure PhotoSelectExV
    @PhotoID int
    ,@UserID int = 0
    ,@ViewUserID int 
    ,@Func char(1) = null
    ,@SortKey char(1) = null
    ,@SortDir char(1) = null
    ,@CategoryID smallint = null
    ,@CritLimited char(1) = 'N'
    ,@DateBegin   char(6) = null
    ,@DateEnd   char(6) = null
    as

    select U.UserID, U.Rating as TRating, U.FavCnt, P.Title, P.Hit, P.Rating, P.PanelRating, P.Comment, P.Music, P.CDate, P.Border
    from Users U join Photos P on U.UserID = P.UserID
    where P.PhotoID = @PhotoID

    select CS.CategoryID, CS.[Desc]
    from PhotoCategories CS join CategoriesPhotos C on CS.CategoryID = C.CategoryID
    where C.PhotoID = @PhotoID

    -- PhotoSelectCrits
//    if (@CritLimited = 'Y')
//      select top 100 U.UserID, U.FPanel, C.Comment, C.CDate, case when C.Comment != '' then 1 else 0 end CmtExist
//      from Users U join PhotoCrits C on U.UserID = C.UserID
//      where C.PhotoID = @PhotoID
//      order by CmtExist desc, C.CDate desc
    if (@CritLimited = 'Y')
      select top 100 U.UserID, U.FPanel, C.Comment, C.CDate
      from Users U join PhotoCrits C on U.UserID = C.UserID
      where C.PhotoID = @PhotoID
      order by C.CDate desc
    else
      select U.UserID, U.FPanel, C.Comment, C.CDate
      from Users U join PhotoCrits C on U.UserID = C.UserID
      where C.PhotoID = @PhotoID
      order by C.CDate desc

    -- PhotoCritExists
    select case when exists (select * from PhotoCrits where PhotoID = @PhotoID and UserID = @ViewUserID) then 'Y' else 'N' end as Exist


    if (@Func = 'A')
    begin
      if (@SortKey = 'D')
        select
          isnull((select top 1 A.PhotoID
          from Photos A join Photos B on A.CDate > B.CDate
          where  B.PhotoID = @PhotoID
          order by A.CDate asc),0) PrevID,

          isnull((select top 1 A.PhotoID
          from Photos A join Photos B on A.CDate < B.CDate
          where  B.PhotoID = @PhotoID
          order by A.CDate desc),0) NextID
    end
    else if (@Func = 'C')
    begin
      if (@SortKey = 'D')
        select
          isnull((select top 1 A.PhotoID
          from CategoriesCDatesPhotos A join Photos B on  A.CDate > B.CDate
          where A.CategoryID = @CategoryID and B.PhotoID = @PhotoID
          order by A.CDate asc),0) PrevID,

          isnull((select top 1 A.PhotoID
          from CategoriesCDatesPhotos A join Photos B on  A.CDate < B.CDate
          where A.CategoryID = @CategoryID and B.PhotoID = @PhotoID
          order by A.CDate desc),0) NextID
    end
    else if (@Func = 'U')
    begin
      if (@SortKey = 'D')
        select
          isnull((select top 1 A.PhotoID
          from Photos A join Photos B on A.CDate > B.CDate
          where  B.PhotoID = @PhotoID and A.UserID = @UserID
          order by A.CDate asc),0) PrevID,

          isnull((select top 1 A.PhotoID
          from Photos A join Photos B on A.CDate < B.CDate
          where  B.PhotoID = @PhotoID and A.UserID = @UserID
          order by A.CDate desc),0) NextID
    end
    else if (@Func = 'D')
      if (@SortKey = 'D')
        select
          isnull((select top 1 PhotoID
          from Photos 
          where 
            CDate > (select CDate from Photos where PhotoID = @PhotoID) and
            CDate < @DateEnd
          order by CDate asc),0) PrevID,

          isnull((select top 1 PhotoID
          from Photos 
          where 
            CDate < (select CDate from Photos where PhotoID = @PhotoID) and
            CDate >= @DateBegin
          order by CDate desc),0) NextID
  go

*/