/* TODO

procedure BoxPhotoSelectList
    @Func     char(1)
    ,@UserID    int = 0
    ,@SortKey   char(1) = ''
    ,@SortDir   char(1) = ''
    ,@PageSize    int = 30
    ,@PageNumber  int
    ,@PageCount   int output
    --,@Search    nvarchar(64) = ''
    as

    declare @HeadSize int
    declare @TailSize int
    declare @ReturnSize int
    declare @RowCount int

    if (@Func = 'P') -- 개인 전체 사진
      select @RowCount = count(*) 
      from BoxPhotos where UserID = @UserID
    else if (@Func = 'F') -- 즐겨찾는 사진가들의 최근 사진
      select @RowCount = count(*) 
      from BoxPhotos BP join UserFavs UF on BP.UserID = UF.TargetUserID
      where BP.CDate > getdate() - 10 and UF.OwnerUserID = @UserID
    else -- 전체 최근 사진
      select @RowCount = count(*) 
      from BoxPhotos 
      --where CDate > getdate() - 3
    
    select @PageCount =  (@RowCount - 1) / @PageSize + 1
    select @HeadSize = @PageSize * (@PageNumber + 1)
    select @TailSize = @RowCount - @PageSize * @PageNumber
    select @ReturnSize = case when @PageSize < @TailSize then @PageSize else @TailSize end

    if (@TailSize < 0) return;

    if (@Func = 'P') -- 개인 전체 사진
      begin
        if (@SortKey = 'C') 
        begin
          select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt
          from
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos where UserID = @UserID order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
          order by P.CDate desc
        end
        else
        begin
          select P.PhotoID, P.Title, P.UDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt
          from
            (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, UDate from BoxPhotos where UserID = @UserID order by UDate desc) I order by UDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
          order by P.UDate desc
        end

      end
    else if (@Func = 'F') -- 즐겨찾는 사진가들의 최근 사진
      begin
        select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt, UserID
        from 
          (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos BP join UserFavs UF on BP.UserID = UF.TargetUserID where BP.CDate > getdate() - 10 and UF.OwnerUserID = @UserID  order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
        order by P.CDate desc
      end
    else -- 전체 최근 사진
      begin
        select P.PhotoID, P.Title, P.CDate as Date, P.Hit, case when len(P.Music) > 0 then 'Y' else 'N' end as Music, (select count(*) from BoxPhotoComments where PhotoID = P.PhotoID) as repCnt, UserID
        from (select top (@ReturnSize) * from (select top (@HeadSize) PhotoID, CDate from BoxPhotos BP order by CDate desc) I order by CDate) I join BoxPhotos P on I.PhotoID = P.PhotoID
        order by P.CDate desc
      end
    
    return
  go

*/
