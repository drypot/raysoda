var init = require('../base/init');
var utilp = require('../base/util');
var error = require('../base/error');
var config = require('../base/config');
var mongop = require('../mongo/mongo');
var exp = require('../express/express');
var userb = require('../user/user-base');
var imageb = require('../image/image-base');
var site = require('../image/image-site');
var imagel = exports;

exp.core.get('/', function (req, res, done) {
  list(req, res, false, done);
});

exp.core.get('/api/images', function (req, res, done) {
  list(req, res, true, done);
});

function list(req, res, api, done) {
  var lt = parseInt(req.query.lt) || 0;
  var gt = lt ? 0 : parseInt(req.query.gt) || 0;
  var ps = parseInt(req.query.ps) || 16;
  mongop.findPage(imageb.images, {}, gt, lt, ps, filter, function (err, images, gt, lt) {
    if (err) return done(err);
    if (api) {
      res.json({
        images: images,
        gt: gt,
        lt: lt
      });
    } else {
     res.render('image/image-list', {
       images: images,
       showName: site.showListName,
       suffix: site.thumbnailSuffix,
       gt: gt ? new utilp.UrlMaker('/').add('gt', gt).add('ps', ps, 16).done() : undefined,
       lt: lt ? new utilp.UrlMaker('/').add('lt', lt).add('ps', ps, 16).done() : undefined
     });
    }
  });
}

function filter(image, done) {
  userb.getCached(image.uid, function (err, user) {
    if (err) return done(err);
    image.user = {
      _id: user._id,
      name: user.name,
      home: user.home
    };
    image.dir = imageb.getUrlBase(image._id);
    image.cdateStr = utilp.toDateTimeString(image.cdate);
    done(null, image);
  });
}

/* TODO

procedure PhotoSelectList
    @Func     char(1)
    ,@SortKey   char(1)
    ,@SortDir   char(1)
    ,@CategoryID  smallint = null
    ,@UserID    int = null
    ,@DateBegin   char(6) = null
    ,@DateEnd   char(6) = null
    ,@PageSize    int = 30
    ,@PageNumber  int
    ,@PageCount   int output
    ,@RowCount    int output
    ,@Search    nvarchar(64) = ''
    as

    declare @HeadSize int
    declare @RevHeadSize int
    declare @TailSize int
    declare @ReturnSize int

    if (@SortKey = 'H') 
      select @PageSize = 15
      
    if (@Func = 'A') -- All
      select @RowCount = count(*) 
      from Photos
    else if (@Func = 'C') -- by Category
      select @RowCount = count(*)
      from CategoriesPhotos
      where CategoryID = @CategoryID
    else if (@Func = 'D')  -- By Date
      select @RowCount = count(*)
      from Photos
      where CDate between @DateBegin and @DateEnd
    else if (@Func = 'U') -- by User
      select @RowCount = count(*)
      from Photos
      where UserID = @UserID
    else if (@Func = 'M') -- by User Comment
      select @RowCount = count(*)
      from PhotoCrits
      where UserID = @UserID
    else if (@Func = 'F') -- 즐겨찾는 사진가들의 최근 사진
      select @RowCount = count(*) 
      from (
        select max(P.PhotoID)PhotoID
        from 
          Photos P join 
          UserFavs UF on P.UserID = UF.TargetUserID
        where 
          UF.OwnerUserID = @UserID
        group by P.UserID
      ) PhotoIDs

    select @PageCount =  (@RowCount - 1) / @PageSize + 1
    select @HeadSize = @PageSize * (@PageNumber + 1)
    select @RevHeadSize = @RowCount - @HeadSize + @PageSize
    select @TailSize = @RowCount - @PageSize * @PageNumber
    select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

    if (@TailSize < 0) return;

    if (@Func = 'A') -- All
    begin
      if (@HeadSize < @RevHeadSize)
      begin
        if (@SortKey != 'H')
          select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
          from 
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from Photos order by CDate desc) I order by CDate) I join Photos P on I.PhotoID = P.PhotoID 
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
        else
          select P.PhotoID, P.CDate, U.UserID, U.Rating as TRating
          from 
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from Photos order by CDate desc) I order by CDate) I join Photos P on I.PhotoID = P.PhotoID 
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
      end
      else
      begin
        if (@SortKey != 'H')
          select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
          from 
            (select top (@ReturnSize) * from (select top (@RevHeadSize) PhotoID, CDate from Photos order by CDate) I order by CDate desc) I join Photos P on I.PhotoID = P.PhotoID 
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
        else
          select P.PhotoID, P.CDate, U.UserID, U.Rating as TRating
          from 
            (select top (@ReturnSize) * from (select top (@RevHeadSize) PhotoID, CDate from Photos order by CDate) I order by CDate desc) I join Photos P on I.PhotoID = P.PhotoID 
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
      end
    end
    else if (@Func = 'C') -- by Category
    begin
      if (@HeadSize < @RevHeadSize)
      begin
        if (@SortKey != 'H')
          select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
          from 
            (select top (@ReturnSize) * from (select top (@HeadSize) * from CategoriesCDatesPhotos with (noexpand) where CategoryID = @CategoryID order by CDate desc) P order by CDate) I join Photos P on I.PhotoID = P.PhotoID
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
        else
          select P.PhotoID, P.CDate, U.UserID, U.Rating as TRating
          from 
            (select top (@ReturnSize) * from (select top (@HeadSize) * from CategoriesCDatesPhotos with (noexpand) where CategoryID = @CategoryID order by CDate desc) P order by CDate) I join Photos P on I.PhotoID = P.PhotoID
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
      end
      else
      begin
        if (@SortKey != 'H')
          select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
          from 
            (select top (@ReturnSize) * from (select top (@RevHeadSize) * from CategoriesCDatesPhotos with (noexpand) where CategoryID = @CategoryID order by CDate) P order by CDate desc) I join Photos P on I.PhotoID = P.PhotoID
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
        else
          select P.PhotoID, P.CDate, U.UserID, U.Rating as TRating
          from 
            (select top (@ReturnSize) * from (select top (@RevHeadSize) * from CategoriesCDatesPhotos with (noexpand) where CategoryID = @CategoryID order by CDate) P order by CDate desc) I join Photos P on I.PhotoID = P.PhotoID
            join Users U on U.UserID = P.UserID
          order by P.CDate desc
      end
    end
    else if (@Func = 'D')  -- By Day
    begin
      if (@SortKey = 'D')
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
        from 
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from Photos where CDate between @DateBegin and @DateEnd order by CDate desc) P order by CDate) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.CDate desc
      else if (@SortKey = 'H') -- History View
        select P.PhotoID, P.CDate,  U.UserID, U.Rating as TRating
        from
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from Photos where CDate between @DateBegin and @DateEnd order by CDate desc)P order by CDate) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.CDate desc
      else if (@SortKey = 'R') -- by Rating
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
        from
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate, Rating from Photos where CDate between @DateBegin and @DateEnd order by Rating desc, PhotoID desc)P order by Rating, PhotoID) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.Rating desc, P.PhotoID desc
      else if (@SortKey = 'P') -- by PanelRating
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
        from 
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate, Rating, PanelRating from Photos where CDate between @DateBegin and @DateEnd order by PanelRating desc, Rating desc, PhotoID desc)P order by PanelRating, Rating, PhotoID) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.PanelRating desc, P.Rating desc, P.PhotoID desc
    end
    else if (@Func = 'U') -- by User
    begin
      if (@SortKey = 'D') -- by CDate
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
        from
          (select top (@ReturnSize) * from (select top (@HeadSize)  PhotoID, CDate from Photos where UserID = @UserID order by CDate desc) P order by CDate) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.CDate desc
      else if (@SortKey = 'U') -- by UDate
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, P.UDate
        from
          (select top (@ReturnSize) * from (select top (@HeadSize)  PhotoID, UDate from Photos where UserID = @UserID order by UDate desc) P order by UDate) I join Photos P on I.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by P.UDate desc
    end
    else if (@Func = 'M') -- by User Comment
    begin
      if (@SortKey = 'D') -- by Date
        select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, C.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, C.Comment
        from
          (select top (@ReturnSize) * from (select top (@HeadSize) * from PhotoCrits where UserID = @UserID order by CDate desc) C order by CDate) C join Photos P on C.PhotoID = P.PhotoID
          join Users U on U.UserID = P.UserID
        order by C.CDate desc
    end 
    else if (@Func = 'F') -- 즐겨찾는 사진가의 최근 사진
    begin
      select U.UserID, U.Rating as TRating, U.FavCnt, P.PhotoID, P.Title, P.CDate, P.Rating, P.PanelRating, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music
      from
        (select top (@ReturnSize) * from (select top (@HeadSize)  max(P.PhotoID) PhotoID from Photos P join UserFavs UF on P.UserID = UF.TargetUserID where UF.OwnerUserID = @UserID group by P.UserID order by PhotoID desc) I order by PhotoID) I join Photos P on I.PhotoID = P.PhotoID
        join Users U on U.UserID = P.UserID
      order by P.CDate desc
    end
  go


*/
