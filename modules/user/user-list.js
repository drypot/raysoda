var init = require('../base/init');
var error = require('../base/error');
var config = require('../base/config');
var exp = require('../express/express');
var userb = require('../user/user-base');

exp.core.get('/users', function (req, res, done) {
  userb.users.count(function (err, count) {
    if (err) return done(err);
    res.render('user/user-list', { count: count });
  });
});


/* TODO
procedure UserSelectList
    @Func     char(1)
    ,@SortKey   char(1)
    ,@SortDir   char(1)
    ,@PageSize    int = 100
    ,@PageNumber  int
    ,@PageCount   int output
    ,@RowCount    int output
    as

      declare @HeadSize int
      declare @TailSize int
      declare @ReturnSize int

      if (@SortKey = 'P') -- popularity
        select @RowCount = count(*) from Users where Status != 'T' and FavCnt > 0
      else
        select @RowCount = count(*) from Users where Status != 'T'

      select @PageCount =  (@RowCount - 1) / @PageSize + 1
      select @HeadSize = @PageSize * (@PageNumber + 1)
      select @TailSize = @RowCount - @PageSize * @PageNumber
      select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

      if (@SortKey = 'N')
      begin
        select *
        from (
          select top (@ReturnSize) *
          from (
            select top (@HeadSize) UserID, NickName, RealName, Rating, FavCnt, CDate from Users
            where Status != 'T' order by NickName
          ) R 
          order by NickName desc
        ) R 
        order by NickName
      end
      else if (@SortKey = 'R')
      begin
        select *
        from (
          select top (@ReturnSize) *
          from (
            select top (@HeadSize) UserID, NickName, RealName, Rating, FavCnt, CDate from Users
            where Status != 'T' order by RealName
          ) R 
          order by RealName desc
        ) R 
        order by RealName
      end if (@SortKey = 'C')
      begin
        select *
        from (
          select top (@ReturnSize) *
          from (
            select top (@HeadSize) UserID, NickName, RealName, Rating, FavCnt, CDate from Users
            where Status != 'T' order by CDate desc
          ) R 
          order by CDate
        ) R 
        order by CDate desc
      end if (@SortKey = 'P')
      begin
        select *
        from (
          select top (@ReturnSize) *
          from (
            select top (@HeadSize) UserID, NickName, RealName, Rating, FavCnt, CDate from Users
            where Status != 'T' and FavCnt > 0 order by FavCnt desc, NickName
          ) R 
          order by FavCnt, NickName desc
        ) R 
        order by FavCnt desc, NickName
      end
*/
